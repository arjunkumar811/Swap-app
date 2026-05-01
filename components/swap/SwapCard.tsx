'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRightLeft, Copy, ExternalLink, Wallet } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';
import TokenInput from './TokenInput';
import TokenSelector from './TokenSelector';
import PriceDetails from './PriceDetails';
import SettingsModal from './SettingsModal';
import PreviewModal from './PreviewModal';
import SwapButton from './SwapButton';
import TransactionStatus from './TransactionStatus';
import SwapErrorAlert from './SwapErrorAlert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useSwapStore } from '@/store/swapStore';
import { useTokenList } from '@/lib/jupiter/useTokenList';
import { useQuote } from '@/lib/jupiter/useQuote';
import { useSwapExecution } from '@/lib/jupiter/useSwapExecution';
import { useTokenBalance } from '@/lib/jupiter/useTokenBalance';
import { toSwapError } from '@/lib/jupiter/errors';
import { DEFAULT_MINTS } from '@/lib/tokens';
import type { Token } from '@/types/token';

function shortenAddress(address?: string) {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

const SOL_TOKEN: Token = {
  address: DEFAULT_MINTS.SOL,
  symbol: 'SOL',
  name: 'Solana',
  decimals: 9
};

export default function SwapCard() {
  const { publicKey, signTransaction, connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const s = useSwapStore();
  const { tokens, error: tokenListError, inputDefault, outputDefault } = useTokenList();
  const walletAddress = publicKey?.toBase58();

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectorSide, setSelectorSide] = useState<'input' | 'output'>('input');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [priorityFee, setPriorityFee] = useState(false);
  const [flipCount, setFlipCount] = useState(0);

  const { balance: inputBalance, balanceText, loading: balanceLoading, error: balanceError } = useTokenBalance({
    connection,
    owner: walletAddress,
    token: s.inputToken
  });

  const { balance: solBalance } = useTokenBalance({
    connection,
    owner: walletAddress,
    token: SOL_TOKEN
  });

  useQuote({
    onError: (message) => {
      s.setLastError(toSwapError(new Error(message), message, { code: 'QUOTE_FAILED', source: 'quote' }));
      toast.error(message);
    }
  });

  const { executeSwap } = useSwapExecution();

  useEffect(() => {
    if (!inputDefault || !outputDefault) return;
    s.setInputToken(inputDefault);
    s.setOutputToken(outputDefault);
  }, [inputDefault?.address, outputDefault?.address]);

  useEffect(() => {
    if (tokenListError) {
      s.setLastError(toSwapError(new Error(tokenListError), tokenListError, { code: 'TOKEN_LIST_FAILED', source: 'tokens' }));
      toast.error(tokenListError);
    }
  }, [tokenListError]);

  useEffect(() => {
    if (balanceError) {
      s.setLastError(toSwapError(new Error(balanceError), balanceError, { code: 'BALANCE_FAILED', source: 'balance' }));
    }
  }, [balanceError]);

  const outputAmount = useMemo(() => {
    if (!s.quote || !s.outputToken) return '';
    return (Number(s.quote.outAmount) / 10 ** s.outputToken.decimals).toFixed(6);
  }, [s.quote, s.outputToken]);

  const validationMessage = useMemo(() => {
    const amount = Number(s.amount);
    if (!connected) return 'Connect a wallet to continue.';
    if (!s.inputToken || !s.outputToken) return 'Select both tokens.';
    if (s.inputToken.address === s.outputToken.address) return 'Select two different tokens.';
    if (!amount || amount <= 0) return 'Enter an amount to swap.';
    if (inputBalance !== undefined && amount > inputBalance) return 'Insufficient balance.';
    if (!s.quote) return 'Fetching the best route...';
    return undefined;
  }, [connected, s.inputToken, s.outputToken, s.amount, inputBalance, s.quote]);

  const canSwap = Boolean(
    connected &&
      s.inputToken &&
      s.outputToken &&
      s.quote &&
      !s.loadingQuote &&
      !s.swapping &&
      !validationMessage
  );

  const prevStatus = useRef(s.txStatus);
  useEffect(() => {
    if (prevStatus.current === s.txStatus) return;
    prevStatus.current = s.txStatus;
    if (s.txStatus === 'submitting') toast('Transaction submitted');
    if (s.txStatus === 'success') toast.success('Transaction confirmed');
    if (s.txStatus === 'error') toast.error('Transaction failed');
  }, [s.txStatus]);

  function handleOpenSelector(side: 'input' | 'output') {
    setSelectorSide(side);
    setSelectorOpen(true);
  }

  function handleSelectToken(token: Token) {
    if (selectorSide === 'input') s.setInputToken(token);
    else s.setOutputToken(token);
  }

  function handleFlip() {
    s.flipTokens();
    setFlipCount((prev) => prev + 1);
  }

  function handleMax() {
    if (inputBalance === undefined) return;
    s.setAmount(inputBalance.toString());
  }

  async function handleSwap() {
    if (!connected || !publicKey || !signTransaction) {
      toast.error('Connect wallet first');
      return;
    }
    if (!s.quote) return;
    setPreviewOpen(true);
  }

  async function handleConfirmSwap() {
    if (!connected || !publicKey || !signTransaction) return;
    setPreviewOpen(false);
    await executeSwap({
      connection,
      userPublicKey: publicKey.toBase58(),
      signTransaction
    });
  }

  return (
    <div className='w-full max-w-xl'>
      <div className='rounded-[28px] bg-gradient-to-br from-white/10 via-white/5 to-transparent p-[1px] shadow-[0_25px_90px_rgba(7,12,25,0.7)]'>
        <div className='rounded-[27px] border border-white/10 bg-[#0b111d]/90 p-5 backdrop-blur-2xl'>
          <div className='mb-5 flex items-center justify-between'>
            <div>
              <div className='text-xs uppercase tracking-[0.3em] text-white/40'>Swap</div>
              <div className='text-lg font-semibold text-white'>Jupiter routing</div>
            </div>
            <Button variant='secondary' size='sm' onClick={() => setSettingsOpen(true)}>
              Settings
            </Button>
          </div>

          <div className='mb-4 rounded-2xl border border-white/10 bg-black/40 p-3'>
            {connected && walletAddress ? (
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5'>
                    <Wallet size={18} className='text-white/70' />
                  </div>
                  <div>
                    <div className='text-sm font-semibold text-white'>{shortenAddress(walletAddress)}</div>
                    <div className='text-xs text-white/50'>Balance {solBalance ? solBalance.toFixed(4) : '--'} SOL</div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    onClick={() => navigator.clipboard.writeText(walletAddress)}
                    className='rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10'
                  >
                    <Copy size={14} />
                  </button>
                  <a
                    href={`https://solscan.io/account/${walletAddress}`}
                    target='_blank'
                    rel='noreferrer'
                    className='rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10'
                  >
                    <ExternalLink size={14} />
                  </a>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10'>
                        Manage
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Wallet</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(walletAddress)}>
                        <Copy size={14} /> Copy address
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => disconnect()}>
                        Disconnect wallet
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}>
                        <ExternalLink size={14} /> View on explorer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between'>
                <div>
                  <div className='text-sm font-semibold text-white'>Connect your wallet</div>
                  <div className='text-xs text-white/50'>Select a wallet to start swapping.</div>
                </div>
                <WalletMultiButton className='!h-11 !rounded-2xl !bg-white/10 !px-4 !text-sm hover:!bg-white/20' />
              </div>
            )}
          </div>

          <div className='space-y-3'>
            <TokenInput
              kind='sell'
              token={s.inputToken}
              amount={s.amount}
              onAmountChange={(value) => s.setAmount(value)}
              onOpenTokenSelector={() => handleOpenSelector('input')}
              balanceText={balanceText}
              balanceLoading={balanceLoading}
              onMax={handleMax}
              fiatValue='≈ $--'
              disabled={!connected}
            />

            <div className='flex justify-center'>
              <motion.button
                type='button'
                onClick={handleFlip}
                animate={{ rotate: flipCount * 180 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className='-my-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 shadow-[0_10px_24px_rgba(0,0,0,0.35)] hover:bg-white/10'
              >
                <ArrowRightLeft size={18} />
              </motion.button>
            </div>

            <TokenInput
              kind='buy'
              token={s.outputToken}
              amount={outputAmount}
              onOpenTokenSelector={() => handleOpenSelector('output')}
              fiatValue='≈ $--'
              disabled
            />
          </div>

          <div className='mt-4 space-y-3'>
            <PriceDetails quote={s.quote} slippageBps={s.slippageBps} outputToken={s.outputToken} onOpenSettings={() => setSettingsOpen(true)} />
            {validationMessage && (
              <div className='rounded-2xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100'>
                {validationMessage}
              </div>
            )}
            <SwapErrorAlert error={s.lastError} onDismiss={s.clearLastError} />
          </div>

          <div className='mt-4'>
            <div className='sticky bottom-4 z-10'>
              <SwapButton onClick={handleSwap} disabled={!canSwap} loading={s.swapping} label={connected ? 'Review swap' : 'Connect wallet'} />
            </div>
          </div>

          <AnimatePresence mode='wait'>
            {s.txStatus !== 'idle' && (
              <motion.div key={s.txStatus + (s.txid ?? '')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TransactionStatus status={s.txStatus} txid={s.txid} error={s.txError} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <TokenSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        tokens={tokens}
        selected={selectorSide === 'input' ? s.inputToken : s.outputToken}
        onSelect={handleSelectToken}
      />

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        slippageBps={s.slippageBps}
        onSlippageChange={(value) => s.setSlippageBps(value)}
        deadlineMinutes={deadlineMinutes}
        onDeadlineChange={setDeadlineMinutes}
        priorityFee={priorityFee}
        onPriorityFeeChange={setPriorityFee}
      />

      <PreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        inputToken={s.inputToken}
        outputToken={s.outputToken}
        amount={s.amount}
        quote={s.quote}
        slippageBps={s.slippageBps}
        onConfirm={handleConfirmSwap}
        loading={s.swapping}
      />
    </div>
  );
}
