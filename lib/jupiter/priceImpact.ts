export type PriceImpactLevel = 'low' | 'medium' | 'high' | 'unknown';

export type PriceImpactInfo = {
  percent?: number;
  percentLabel: string;
  level: PriceImpactLevel;
};

export function getPriceImpactInfo(priceImpactPct?: string): PriceImpactInfo {
  if (!priceImpactPct) {
    return { percentLabel: '--', level: 'unknown' };
  }

  const raw = Number(priceImpactPct);
  if (!Number.isFinite(raw)) {
    return { percentLabel: '--', level: 'unknown' };
  }

  const percent = raw * 100;
  const level: PriceImpactLevel = percent >= 3 ? 'high' : percent >= 1 ? 'medium' : 'low';
  return { percent, percentLabel: `${percent.toFixed(2)}%`, level };
}
