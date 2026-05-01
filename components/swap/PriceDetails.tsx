'use client';

import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { JupiterQuote } from '@/lib/jupiter/quote';
import type { Token } from '@/types/token';
import { getPriceImpactInfo } from '@/lib/jupiter/priceImpact';
import { getRouteInfo } from '@/lib/jupiter/route';
import { bpsToPercentLabel } from '@/lib/jupiter/slippage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const impactTone: Record<'low' | 'medium' | 'high' | 'unknown', string> = {
  low: 'text-emerald-300',
  medium: 'text-amber-300',
  high: 'text-red-300',
  unknown: 'text-white/60'
};

type Props = {
  quote?: JupiterQuote;
  slippageBps: number;
  outputToken?: Token;
  onOpenSettings: () => void;
};

export default function PriceDetails({ quote, slippageBps, outputToken, onOpenSettings }: Props) {
  const [routeOpen, setRouteOpen] = useState(false);
  const impact = useMemo(() => getPriceImpactInfo(quote?.priceImpactPct), [quote?.priceImpactPct]);
  const routeInfo = useMemo(() => getRouteInfo(quote), [quote]);

  const minimumReceived = useMemo(() => {
    if (!quote || !outputToken) return '--';
    const out = Number(quote.outAmount) / 10 ** outputToken.decimals;
    const min = out * (1 - slippageBps / 10000);
    if (!Number.isFinite(min)) return '--';
    return `${min.toFixed(6)} ${outputToken.symbol}`;
  }, [quote, outputToken, slippageBps]);

  return (
    <div className='rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/70'>
      <div className='flex items-center justify-between py-1'>
        <span>Price impact</span>
        <span className={cn('font-semibold', impactTone[impact.level])}>{impact.percentLabel}</span>
      </div>
      <div className='flex items-center justify-between py-1'>
        <span>Slippage</span>
        <button type='button' onClick={onOpenSettings} className='text-white/80 hover:text-white'>
          {bpsToPercentLabel(slippageBps)}% (edit)
        </button>
      </div>
      <div className='flex items-center justify-between py-1'>
        <span>Route</span>
        <button type='button' onClick={() => setRouteOpen(true)} className='text-white/80 hover:text-white'>
          {routeInfo.display}
        </button>
      </div>
      <div className='flex items-center justify-between py-1'>
        <span>Network fee</span>
        <span>--</span>
      </div>
      <div className='flex items-center justify-between py-1'>
        <span>Minimum received</span>
        <span>{minimumReceived}</span>
      </div>

      <Dialog open={routeOpen} onOpenChange={setRouteOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Route details</DialogTitle>
          </DialogHeader>
          {routeInfo.labels.length === 0 ? (
            <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70'>
              No route data available yet.
            </div>
          ) : (
            <div className='space-y-3'>
              {routeInfo.labels.map((label, index) => (
                <div key={`${label}-${index}`} className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
                  <div>
                    <div className='text-sm font-semibold text-white'>{label}</div>
                    <div className='text-xs text-white/50'>Pool {index + 1}</div>
                  </div>
                  <a
                    href='https://jup.ag'
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-1 text-xs text-white/70 hover:text-white'
                  >
                    View <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
