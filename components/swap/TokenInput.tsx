'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Token } from '@/types/token';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  kind: 'sell' | 'buy';
  token?: Token;
  amount: string;
  onAmountChange?: (value: string) => void;
  onOpenTokenSelector: () => void;
  balanceText?: string;
  balanceLoading?: boolean;
  onMax?: () => void;
  fiatValue?: string;
  disabled?: boolean;
};

export default function TokenInput({
  kind,
  token,
  amount,
  onAmountChange,
  onOpenTokenSelector,
  balanceText,
  balanceLoading,
  onMax,
  fiatValue,
  disabled
}: Props) {
  const isSell = kind === 'sell';

  return (
    <div className={cn('rounded-3xl border border-white/10 bg-black/35 p-4', disabled && 'opacity-70')}>
      <div className='mb-3 flex items-center justify-between text-xs text-white/60'>
        <span className='uppercase tracking-[0.3em]'>{isSell ? 'You pay' : 'You receive'}</span>
        <div className='flex items-center gap-2'>
          {balanceLoading ? (
            <span className='h-3 w-20 animate-pulse rounded bg-white/10' />
          ) : (
            <span>{balanceText || '--'}</span>
          )}
          {isSell && onMax && (
            <button
              type='button'
              onClick={onMax}
              className='rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70 hover:bg-white/10'
            >
              Max
            </button>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <motion.input
          key={token?.address ?? 'empty'}
          value={amount}
          onChange={(event) => onAmountChange?.(event.target.value)}
          placeholder='0.0'
          disabled={disabled}
          className='w-full bg-transparent text-4xl font-semibold text-white placeholder:text-white/30 outline-none sm:text-5xl'
        />
        <Button
          type='button'
          variant='secondary'
          className='h-auto w-full justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left sm:w-56'
          onClick={onOpenTokenSelector}
        >
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5'>
              {token?.logoURI ? (
                <img src={token.logoURI} alt={token.symbol} className='h-6 w-6 rounded-full' />
              ) : (
                <span className='text-xs font-semibold text-white/60'>{token?.symbol?.[0] ?? '?'}</span>
              )}
            </div>
            <div>
              <div className='text-sm font-semibold text-white'>{token?.symbol ?? 'Select'}</div>
              <div className='text-xs text-white/60'>{token?.name ?? 'Token'}</div>
            </div>
          </div>
          <ChevronDown size={16} className='text-white/60' />
        </Button>
      </div>
      <div className='mt-3 text-xs text-white/50'>{fiatValue ?? '≈ $--'}</div>
    </div>
  );
}
