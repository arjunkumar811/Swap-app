import type { JupiterQuote } from './quote';

export type RouteInfo = {
  labels: string[];
  display: string;
};

export function getRouteInfo(quote?: JupiterQuote): RouteInfo {
  if (!quote?.routePlan?.length) {
    return { labels: [], display: '--' };
  }

  const labels = quote.routePlan
    .map((step) => step?.swapInfo?.label?.trim())
    .filter((label): label is string => Boolean(label));

  if (!labels.length) {
    return { labels: [], display: '--' };
  }

  return {
    labels,
    display: labels.join(' -> ')
  };
}
