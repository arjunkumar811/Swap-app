'use client';

import { useMemo } from 'react';
import type { Token } from '@/types/token';
import type { JupiterQuote } from '@/lib/jupiter/quote';
import { getRouteInfo } from '@/lib/jupiter/route';
import { bpsToPercentLabel } from '@/lib/jupiter/slippage';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function formatAmount(raw: string | undefined, decimals: number) {
  if (!raw) return '--';
  const value = Number(raw) / 10 ** decimals;
  if (!Number.isFinite(value)) return '--';
  return value.toFixed(6);
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputToken?: Token;
  outputToken?: Token;
  amount: string;
  quote?: JupiterQuote;
  slippageBps: number;
  onConfirm: () => void;
  loading: boolean;
};

export default function PreviewModal({
  open,
  onOpenChange,
  inputToken,
  outputToken,
  amount,
  quote,
  slippageBps,
  onConfirm,
  loading
}: Props) {
  const routeInfo = useMemo(() => getRouteInfo(quote), [quote]);
  const minReceived = useMemo(() => {
    if (!quote || !outputToken) return '--';
    const out = Number(quote.outAmount) / 10 ** outputToken.decimals;
    const min = out * (1 - slippageBps / 10000);
    if (!Number.isFinite(min)) return '--';
    return `${min.toFixed(6)} ${outputToken.symbol}`;
  }, [quote, outputToken, slippageBps]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Preview swap</DialogTitle>
        </DialogHeader>
        <div className='mt-4 space-y-3'>
          <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
            <div className='text-xs text-white/50'>You pay</div>
            <div className='text-lg font-semibold text-white'>
              {amount || '0'} {inputToken?.symbol ?? ''}
            </div>
          </div>
          <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
            <div className='text-xs text-white/50'>You receive (est.)</div>
            <div className='text-lg font-semibold text-white'>
              {outputToken ? formatAmount(quote?.outAmount, outputToken.decimals) : '--'} {outputToken?.symbol ?? ''}
            </div>
          </div>
          <div className='rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/70'>
            <div className='flex items-center justify-between py-1'>
              <span>Estimated fee</span>
              <span>--</span>
            </div>
            <div className='flex items-center justify-between py-1'>
              <span>Route</span>
              <span>{routeInfo.display}</span>
            </div>
            <div className='flex items-center justify-between py-1'>
              <span>Slippage</span>
              <span>{bpsToPercentLabel(slippageBps)}%</span>
            </div>
            <div className='flex items-center justify-between py-1'>
              <span>Minimum received</span>
              <span>{minReceived}</span>
            </div>
          </div>
        </div>
        <DialogFooter className='mt-6'>
          <Button onClick={onConfirm} disabled={loading} className='w-full'>
            {loading ? 'Confirming...' : 'Confirm swap'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
