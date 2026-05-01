import type { Token } from '@/types/token';
import { JupiterApiError } from './errors';

function isToken(value: unknown): value is Token {
  if (!value || typeof value !== 'object') return false;
  const token = value as Partial<Token>;
  return (
    typeof token.address === 'string' &&
    typeof token.symbol === 'string' &&
    typeof token.name === 'string' &&
    typeof token.decimals === 'number'
  );
}

export function normalizeTokens(data: unknown): Token[] {
  const rawList = Array.isArray(data)
    ? data
    : data && typeof data === 'object'
      ? Object.values(data)
      : [];

  return rawList.filter(isToken);
}

export async function fetchJupiterTokens(): Promise<Token[]> {
  let res: Response;
  try {
    res = await fetch('/api/tokens', { cache: 'no-store' });
  } catch (error) {
    throw new JupiterApiError('Network error while fetching token list', { details: error });
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new JupiterApiError('Invalid token list response format', { status: res.status });
  }

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : 'Failed to fetch token list';
    throw new JupiterApiError(message, { status: res.status, details: data });
  }

  const tokens = normalizeTokens(data);
  if (tokens.length === 0) {
    throw new JupiterApiError('Token list is empty');
  }

  return tokens;
}
