'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightLeft, ExternalLink, Copy } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import AmountInput from './AmountInput';
import WalletButton from './WalletButton';
import SettingsPopover from './SettingsPopover';
import TokenSelector from './swap/TokenSelector';
import { useTokenList } from '@/lib/jupiter/useTokenList';
import { useQuote } from '@/lib/jupiter/useQuote';
import { useSwapExecution } from '@/lib/jupiter/useSwapExecution';
import { useSwapStore } from '@/store/swapStore';
import SwapButton from './SwapButton';

export default function SwapCard() {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { tokens, loading: searching, error: tokenListError, inputDefault, outputDefault } = useTokenList();
  const s = useSwapStore();
  useQuote({ onError: (message) => toast.error(message) });
  const { executeSwap } = useSwapExecution({
    onSuccess: () => toast.success('Swap confirmed'),
    onError: (message) => toast.error(message)
  });

  useEffect(() => {
    if (!inputDefault || !outputDefault) return;
    s.setInputToken(inputDefault);
    s.setOutputToken(outputDefault);
  }, [inputDefault?.address, outputDefault?.address]);

  useEffect(() => {
    if (tokenListError) toast.error(tokenListError);
  }, [tokenListError]);

  const outAmount = useMemo(() => {
    if (!s.quote || !s.outputToken) return '--';
    return (Number(s.quote.outAmount) / 10 ** s.outputToken.decimals).toFixed(6);
  }, [s.quote, s.outputToken]);

  async function onSwap() {
    if (!connected || !publicKey || !signTransaction) return toast.error('Connect wallet first');
    await executeSwap({
      connection,
      userPublicKey: publicKey.toBase58(),
      signTransaction
    });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className='w-full max-w-2xl'>
      <h1 className='mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl'>Swap anytime, anywhere.</h1>
      <div className='rounded-[30px] border border-white/10 bg-[#0a0c12]/95 p-5 shadow-2xl backdrop-blur-xl'>
        <div className='mb-4 flex items-center justify-between'><WalletButton /><SettingsPopover slippageBps={s.slippageBps} onSet={s.setSlippageBps} /></div>
        <div className='rounded-[28px] border border-white/10 bg-[#0a0c12] p-4'>
          <AmountInput value={s.amount} onChange={s.setAmount} label='Sell' />
          <TokenSelector tokens={tokens} selected={s.inputToken} onSelect={s.setInputToken} label='From' loading={searching} />
        </div>
        <button onClick={s.flipTokens} className='relative z-10 -my-2 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#12151d] shadow-[0_4px_0_0_rgba(0,0,0,0.45)] transition hover:bg-[#191d28]'><ArrowRightLeft size={20} /></button>
        <div className='rounded-[28px] border border-white/10 bg-white/[0.08] p-4'>
          <div className='mb-2 text-3xl font-semibold text-white'>{s.loadingQuote ? 'Loading...' : outAmount}</div>
          <TokenSelector tokens={tokens} selected={s.outputToken} onSelect={s.setOutputToken} label='Buy' loading={searching} />
        </div>
        <div className='rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-muted'>
          <div className='flex justify-between'><span>Price impact</span><span>{s.quote ? `${(Number(s.quote.priceImpactPct) * 100).toFixed(2)}%` : '--'}</span></div>
          <div className='flex justify-between'><span>Slippage</span><span>{(s.slippageBps / 100).toFixed(2)}%</span></div>
          <div className='flex justify-between'><span>Route</span><span>{s.quote?.routePlan?.[0]?.swapInfo?.label || '--'}</span></div>
        </div>
        <SwapButton onClick={onSwap} disabled={!connected || !s.quote || s.swapping || s.loadingQuote} loading={s.swapping} />
        <AnimatePresence>
          {s.txid && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='rounded-xl border border-teal-400/30 bg-teal-400/10 p-3 text-xs'>
              <div className='mb-2 text-teal-200'>Transaction confirmed</div>
              <div className='flex items-center gap-2'>
                <button onClick={() => navigator.clipboard.writeText(s.txid!)} className='rounded bg-white/10 p-1'><Copy size={14} /></button>
                <a className='inline-flex items-center gap-1 text-teal-200 hover:underline' href={`https://solscan.io/tx/${s.txid}`} target='_blank'>View <ExternalLink size={12} /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
