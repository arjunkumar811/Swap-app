export const SLIPPAGE_PRESET_BPS = [30, 50, 100] as const;
export const MIN_SLIPPAGE_BPS = 1;
export const MAX_SLIPPAGE_BPS = 5000;

export function isValidSlippageBps(value: number): boolean {
  return Number.isInteger(value) && value >= MIN_SLIPPAGE_BPS && value <= MAX_SLIPPAGE_BPS;
}

export function sanitizeSlippageBps(value: number): number {
  if (!Number.isFinite(value)) return 50;
  const rounded = Math.round(value);
  if (rounded < MIN_SLIPPAGE_BPS) return MIN_SLIPPAGE_BPS;
  if (rounded > MAX_SLIPPAGE_BPS) return MAX_SLIPPAGE_BPS;
  return rounded;
}

export function bpsToPercentLabel(bps: number): string {
  return (bps / 100).toFixed(2);
}

export function parsePercentToBps(input: string): number | undefined {
  const normalized = input.trim();
  if (!normalized) return undefined;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return undefined;
  return Math.round(value * 100);
}
