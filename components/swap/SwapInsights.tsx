'use client';

import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const recentSwaps = [
  { id: 1, from: 'SOL', to: 'USDC', amount: '2.40', time: '2m ago' },
  { id: 2, from: 'USDC', to: 'JUP', amount: '180', time: '9m ago' },
  { id: 3, from: 'BONK', to: 'SOL', amount: '1.2M', time: '23m ago' }
];

const pricePoints = 'M0 60 C 30 40, 60 75, 90 52 S 150 40, 180 28 S 240 15, 270 20 S 330 40, 360 30';

export default function SwapInsights() {
  return (
    <div className='grid gap-6 lg:grid-cols-[1fr_1fr]'>
      <div className='rounded-3xl border border-white/10 bg-white/5 p-5'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <div className='text-xs uppercase tracking-[0.25em] text-white/50'>Market preview</div>
            <div className='text-lg font-semibold text-white'>SOL / USDC</div>
          </div>
          <span className='rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200'>+2.8%</span>
        </div>
        <div className='h-[140px] rounded-2xl border border-white/10 bg-black/30 p-4'>
          <svg viewBox='0 0 360 80' className='h-full w-full'>
            <defs>
              <linearGradient id='chartGradient' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='0%' stopColor='rgba(56,189,248,0.8)' />
                <stop offset='100%' stopColor='rgba(56,189,248,0)' />
              </linearGradient>
            </defs>
            <path d={pricePoints} fill='none' stroke='rgba(56,189,248,0.9)' strokeWidth='3' />
            <path d={`${pricePoints} L 360 80 L 0 80 Z`} fill='url(#chartGradient)' />
          </svg>
        </div>
        <div className='mt-4 grid grid-cols-3 gap-3 text-xs text-white/60'>
          <div>
            <div className='text-white'>24h</div>
            <div>$158.90</div>
          </div>
          <div>
            <div className='text-white'>Volume</div>
            <div>$48.2M</div>
          </div>
          <div>
            <div className='text-white'>Liquidity</div>
            <div>$210M</div>
          </div>
        </div>
      </div>

      <div className='rounded-3xl border border-white/10 bg-white/5 p-5'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <div className='text-xs uppercase tracking-[0.25em] text-white/50'>Recent swaps</div>
            <div className='text-lg font-semibold text-white'>Live activity</div>
          </div>
          <button className='inline-flex items-center gap-1 text-xs text-white/70 hover:text-white'>
            View all <ArrowUpRight size={12} />
          </button>
        </div>
        <div className='space-y-3'>
          {recentSwaps.map((swap) => (
            <div key={swap.id} className={cn('flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3')}>
              <div>
                <div className='text-sm font-semibold text-white'>
                  {swap.amount} {swap.from} → {swap.to}
                </div>
                <div className='text-xs text-white/50'>{swap.time}</div>
              </div>
              <span className='rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70'>
                Confirmed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
