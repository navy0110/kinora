const status = document.querySelector('#status');
import { readAuthority, authorityLabel } from './authority.js';
let authority = null;
const results = document.querySelector('#results');
const form = document.querySelector('#filters');
const exportButton = document.querySelector('#export');
let records = [];
let generation = 0;
function element(tag, text, className) { const node = document.createElement(tag); node.textContent = text; if (className) node.className = className; return node; }
function decode(entity) {
  const p = entity.toJson();
  if (!p || typeof p !== 'object' || ['community','title','description','topic','kind','mode','url'].some(k => typeof p[k] !== 'string')) return null;
  if (!/^[a-z0-9-]{3,40}$/.test(p.community) || !p.title.trim() || p.title.length > 100 || !p.description.trim() || p.description.length > 2000) return null;
  if (!['event','call'].includes(p.kind) || !['online','in-person'].includes(p.mode) || !['Technology','Design','Public goods'].includes(p.topic)) return null;
  if (!Number.isFinite(p.startsAt) || !Number.isFinite(p.endsAt) || p.endsAt <= p.startsAt || p.endsAt <= Date.now()) return null;
  if (p.url && !['https:','http:'].includes(new URL(p.url).protocol)) return null;
  if (entity.attributes.community?.value !== p.community || entity.attributes.ends_at?.value !== BigInt(p.endsAt)) return null;
  if(p.communityKey !== undefined && (typeof p.communityKey !== 'string' || !/^0x[\da-f]{64}$/i.test(p.communityKey)))return null;
  return { community:p.community,communityKey:p.communityKey,title:p.title,description:p.description,topic:p.topic,kind:p.kind,mode:p.mode,startsAt:p.startsAt,endsAt:p.endsAt,url:p.url,id:entity.key,creator:entity.creator,source:'arkiv' };
}
function render() {
  results.replaceChildren();
  if (!records.length) results.append(element('p','No active publications match. Publish synthetic content from the community board, then refresh this reader.','empty'));
  for (const p of records) {
    const card = element('article','');
    card.append(element('div',authorityLabel(p,authority),'meta'));
    card.append(element('div',`${p.community} / ${p.kind === 'call' ? 'OPEN CALL' : 'EVENT'} / ${p.topic}`,'meta'),element('h2',p.title),element('p',p.description),element('p',`${new Date(p.startsAt).toLocaleString('en-US')} → ${new Date(p.endsAt).toLocaleString('en-US')} · ${p.mode}`),element('code',`Onchain creator: ${p.creator}`),element('code',`Entity: ${p.id}`));
    if (p.url) { const link=element('a','Open opportunity ↗'); link.href=p.url;link.target='_blank';link.rel='noreferrer';card.append(link); }
    results.append(card);
  }
  exportButton.disabled = !records.length;
}
exportButton.addEventListener('click', () => { const url=URL.createObjectURL(new Blob([JSON.stringify(records,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='open-agenda.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); });
async function init() {
  try {
    const [{createPublicClient},{tiramisu},{str,u64},{eq,gt},{http}] = await Promise.all([
      import('https://esm.sh/@arkiv-network/sdk@0.8.1?bundle'),
      import('https://esm.sh/@arkiv-network/sdk@0.8.1/chains?bundle'),
      import('https://esm.sh/@arkiv-network/sdk@0.8.1/attr?bundle'),
      import('https://esm.sh/@arkiv-network/sdk@0.8.1/query?bundle'),
      import('https://esm.sh/viem@2.38.0?bundle'),
    ]);
    const reader=createPublicClient({chain:tiramisu,transport:http(undefined,{timeout:15000,retryCount:1})});
    async function load() {
      const run=++generation; status.textContent='Querying Tiramisu directly…';exportButton.disabled=true;results.replaceChildren();
      const community=form.elements.community.value.trim(),kind=form.elements.kind.value;
      const params=new URLSearchParams();if(community)params.set('community',community);if(kind)params.set('kind',kind);history.replaceState(null,'',`?${params}`);
      document.querySelector('#query').textContent=`protocol = "common-ground:v1"\nentity_type = "publication"\nends_at > now (u64 milliseconds)${community ? `\ncommunity = "${community}"` : ''}${kind ? `\nkind = "${kind}"` : ''}\nFields: key, creator, payload, attributes\nCursor pagination: 50 per page`;
      try {
        const query=reader.select({key:true,creator:true,payload:true,attributes:true}).where(eq('protocol',str('common-ground:v1')),eq('entity_type',str('publication')),gt('ends_at',u64(Date.now())));
        if(community)query.where(eq('community',str(community)));if(kind)query.where(eq('kind',str(kind)));
        const page=await query.limit(50).fetch();const found=[];
        do { for(const entity of page.entities){try{const p=decode(entity);if(p)found.push(p);}catch{/* Public input can be malformed. */}}if(!page.hasNextPage())break;await page.next();if(run!==generation)return;}while(true);
        let currentAuthority=null;try{currentAuthority=await readAuthority(reader,eq,str);}catch{/* Fail closed: no authorized labels if registry reads fail. */}
        if(run!==generation)return;authority=currentAuthority;records=found.sort((a,b)=>a.startsAt-b.startsAt);render();status.textContent=`${records.length} active publications · direct read from Tiramisu${authority ? '' : ' · authorization unavailable'}`;
      }catch{if(run===generation){records=[];status.textContent='Could not read Tiramisu. Submit the filters again to retry.';}}
    }
    const params=new URLSearchParams(location.search);form.elements.community.value=params.get('community') || '';form.elements.kind.value=['event','call'].includes(params.get('kind')) ? params.get('kind') : '';
    form.addEventListener('submit',e=>{e.preventDefault();load();});await load();
  }catch{status.textContent='Could not load the Arkiv SDK from esm.sh. Reload this page to retry.';}
}
init();
