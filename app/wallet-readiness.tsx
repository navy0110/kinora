'use client';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { walletStatus } from '../lib/arkiv';
import { walletError } from '../lib/wallet-errors';
export default function WalletReadiness({ account, onConnect }: { account: string; onConnect: () => Promise<void> }) {
  const [status, setStatus] = useState(''), [checking, setChecking] = useState(false);
  useEffect(() => { setStatus(''); }, [account]);
  async function check() {
    if (!account) { setStatus('Connect your EVM wallet first. Never enter a private key here.'); return; }
    setChecking(true);
    try { const info = await walletStatus(account as Address); setStatus(`Tiramisu balance: ${info.balance} test GLM. ${info.funded ? 'Balance detected; transaction fees still apply.' : 'Get test GLM from the faucet.'} ${info.chainId === 7738577 ? 'Wallet is on Tiramisu.' : 'Your wallet will request a switch to Tiramisu when publishing.'}`); }
    catch(e) { setStatus(walletError(e)); } finally { setChecking(false); }
  }
  return <section className="wallet-readiness" aria-label="Publishing checklist"><b>Ready to publish?</b><p>Connect an EVM wallet, fund it with test GLM, then confirm your publication. Only synthetic content belongs in this hackathon demo.</p><div className="community-actions">{!account && <button type="button" className="wallet" onClick={onConnect}>Connect EVM wallet</button>}<button type="button" className="wallet" disabled={checking} onClick={check}>{checking ? 'Checking…' : 'Check network & balance'}</button><a className="wallet" href="https://hub.arkiv.network/" target="_blank" rel="noreferrer">Get test GLM ↗</a></div><p role="status">{status}</p></section>;
}
