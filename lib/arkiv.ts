import { createPublicClient, createWalletClient, ExpirationTime } from '@arkiv-network/sdk';
import { tiramisu } from '@arkiv-network/sdk/chains';
import { str, u64 } from '@arkiv-network/sdk/attr';
import { eq, gt } from '@arkiv-network/sdk/query';
import { jsonToPayload } from '@arkiv-network/sdk/utils';
import { custom, http, formatEther, type EIP1193Provider, type Address } from 'viem';
import { PROTOCOL, decodePublication, validateDraft, type Draft, type Publication } from './contract';
import { authorizedPublisher, validateCommunity, type Community, type OrganizerGrant } from './authority';
export const reader = createPublicClient({ chain: tiramisu, transport: http(undefined, { timeout: 15000, retryCount: 1 }) });
export async function readPublications(community?: string): Promise<Publication[]> {
  const query = reader.select({ key: true, creator: true, payload: true, attributes: true })
    .where(eq('protocol', str(PROTOCOL)), eq('entity_type', str('publication')), gt('ends_at', u64(Date.now())));
  if (community) query.where(eq('community', str(community)));
  const page = await query.limit(50).fetch();
  const result: Publication[] = [];
  do {
    for (const entity of page.entities) {
      try {
        const p = decodePublication(entity.toJson());
        if (p && p.endsAt > Date.now() && entity.attributes.community?.value === p.community && entity.attributes.ends_at?.value === BigInt(p.endsAt)) result.push({ ...p, id: entity.key, creator: entity.creator, source: 'arkiv' });
      } catch { /* Ignore malformed public records. */ }
    }
    if (!page.hasNextPage()) break;
    await page.next();
  } while (true);
  return result.sort((a,b) => a.startsAt - b.startsAt);
}
export function provider(): EIP1193Provider {
  const ethereum = (window as unknown as { ethereum?: EIP1193Provider }).ethereum;
  if (!ethereum) throw new Error('Install an EVM wallet such as MetaMask to publish. Reading does not require a wallet.');
  return ethereum;
}
export async function connect(): Promise<Address> {
  const ethereum = provider();
  const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
  if (!account) throw new Error('No account was returned.');
  return account;
}
export async function walletStatus(account: Address) {
  const chain = await provider().request({ method: 'eth_chainId' });
  const balance = await reader.getBalance({ address: account });
  return { chainId: Number.parseInt(chain, 16), balance: formatEther(balance), funded: balance > 0n };
}
async function signingWallet() {
  const ethereum = provider();
  const account = await connect();
  const chainId = `0x${tiramisu.id.toString(16)}`;
  try { await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] }); }
  catch (error) {
    if ((error as { code?: number }).code !== 4902) throw error;
    await ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId, chainName: tiramisu.name, nativeCurrency: tiramisu.nativeCurrency, rpcUrls: [tiramisu.rpcUrls.default.http[0]] }] });
    await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
  }
  const wallet = createWalletClient({ chain: tiramisu, transport: custom(ethereum), account });
  const balance = await reader.getBalance({ address: account });
  if (balance === 0n) throw new Error('Not enough test GLM. Use the Tiramisu faucet, then check your balance again.');
  return { wallet, account };
}
export async function publish(draft: Draft) {
  const value = validateDraft(draft);
  const { wallet, account } = await signingWallet();
  if (value.communityKey) {
    const { communities, grants } = await readAuthorities();
    const community = communities.find(c => c.id === value.communityKey && c.slug === value.community);
    if (!community || !authorizedPublisher(account,community,grants)) throw new Error('This wallet is not authorized to publish for the selected registered community.');
  }
  validateDraft(value);
  const result = await wallet.createEntity({ payload: jsonToPayload(value), contentType: 'application/json', attributes: {
    protocol: str(PROTOCOL), entity_type: str('publication'), community: str(value.community), ...(value.communityKey ? { community_key: str(value.communityKey) } : {}), kind: str(value.kind), topic: str(value.topic), mode: str(value.mode), starts_at: u64(value.startsAt), ends_at: u64(value.endsAt),
  }, expires: ExpirationTime.fromSeconds(Math.ceil((value.endsAt - Date.now())/1000)), flags: { readonly: true } });
  return { ...result, creator: account };
}
export async function readAuthorities() {
  const communities: Community[] = [], grants: OrganizerGrant[] = [];
  for (const entityType of ['community','organizer_grant']) {
    const page = await reader.select().where(eq('protocol',str(PROTOCOL)),eq('entity_type',str(entityType))).limit(50).fetch();
    do {
      for (const e of page.entities) {
        try {
          if (!e.creationFlags.readonly) continue;
          const p = e.toJson() as Record<string,unknown>;
          if (entityType === 'community' && typeof p.slug === 'string' && typeof p.name === 'string' && typeof p.description === 'string' && e.attributes.community?.value === p.slug) {
            communities.push({ ...validateCommunity(p.slug,p.name,p.description), id:e.key, creator:e.creator });
          } else if (entityType === 'organizer_grant' && typeof p.communityKey === 'string' && /^0x[\da-f]{64}$/i.test(p.communityKey) && typeof p.organizer === 'string' && /^0x[\da-f]{40}$/i.test(p.organizer) && (p.action === 'grant' || p.action === 'revoke') && e.attributes.community_key?.value === p.communityKey) {
            grants.push({ communityKey:p.communityKey,organizer:p.organizer,action:p.action,creator:e.creator,block:e.createdAt });
          }
        } catch { /* Discard malformed public records. */ }
      }
      if (!page.hasNextPage()) break;
      await page.next();
    } while(true);
  }
  return { communities, grants };
}
export async function registerCommunity(slug: string, name: string, description: string) {
  const payload = validateCommunity(slug,name,description);
  const {wallet,account} = await signingWallet();
  const result = await wallet.createEntity({payload:jsonToPayload(payload),contentType:'application/json',attributes:{protocol:str(PROTOCOL),entity_type:str('community'),community:str(slug)},expires:ExpirationTime.fromDays(365),flags:{readonly:true}});
  return {...result,creator:account};
}
export async function setOrganizer(communityKey: string, organizer: string, action: 'grant' | 'revoke') {
  if (!/^0x[\da-f]{40}$/i.test(organizer)) throw new Error('Enter a valid EVM organizer address.');
  const {wallet,account} = await signingWallet();
  const {communities} = await readAuthorities();
  const community = communities.find(c => c.id === communityKey);
  if (!community || community.creator.toLowerCase() !== account.toLowerCase()) throw new Error('Only the community creator can change organizer permissions.');
  return wallet.createEntity({payload:jsonToPayload({communityKey,organizer,action}),contentType:'application/json',attributes:{protocol:str(PROTOCOL),entity_type:str('organizer_grant'),community_key:str(communityKey)},expires:ExpirationTime.fromDays(365),flags:{readonly:true}});
}
