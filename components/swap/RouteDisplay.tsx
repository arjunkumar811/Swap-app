'use client';

import type { JupiterQuote } from '@/lib/jupiter/quote';
import { getRouteInfo } from '@/lib/jupiter/route';

type Props = {
  quote?: JupiterQuote;
  loading?: boolean;
};

export default function RouteDisplay({ quote, loading = false }: Props) {
  if (loading) {
    return <span className='inline-block h-4 w-20 animate-pulse rounded bg-white/10' />;
  }

  const route = getRouteInfo(quote);
  if (!route.labels.length) return <span>--</span>;

  return (
    <span className='max-w-56 truncate text-right' title={route.display}>
      {route.display}
    </span>
  );
}
