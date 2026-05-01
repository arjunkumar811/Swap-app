'use client';

import { getPriceImpactInfo } from '@/lib/jupiter/priceImpact';

type Props = {
  priceImpactPct?: string;
  loading?: boolean;
};

const toneByLevel = {
  low: 'text-emerald-300',
  medium: 'text-amber-300',
  high: 'text-red-300',
  unknown: 'text-muted'
} as const;

export default function PriceImpactDisplay({ priceImpactPct, loading = false }: Props) {
  if (loading) {
    return <span className='inline-block h-4 w-14 animate-pulse rounded bg-white/10' />;
  }

  const info = getPriceImpactInfo(priceImpactPct);
  return <span className={toneByLevel[info.level]}>{info.percentLabel}</span>;
}
