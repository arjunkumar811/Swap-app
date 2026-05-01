import type { Token } from '@/types/token';
import { fetchJupiterQuote, type FetchQuoteParams, type JupiterQuote } from './jupiter/quote';
export type { JupiterQuote } from './jupiter/quote';

export async function fetchTokens(): Promise<Token[]> {
  const res = await fetch('/api/tokens', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch token list');
  const data = await res.json();
  return normalizeTokens(data);
}

function normalizeTokens(data: unknown): Token[] {
  if (Array.isArray(data)) return data as Token[];
  if (data && typeof data === 'object') {
    const values = Object.values(data);
    if (values.length > 0) return values as Token[];
  }
  return [];
}

export async function fetchQuote(
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps: number
): Promise<JupiterQuote> {
  const params: FetchQuoteParams = { inputMint, outputMint, amount, slippageBps };
  return fetchJupiterQuote(params);
}

export async function createSwapTx(payload: {
  quoteResponse: JupiterQuote;
  userPublicKey: string;
  wrapAndUnwrapSol?: boolean;
}) {
  const res = await fetch('/api/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to build swap transaction');
  return res.json() as Promise<{ swapTransaction: string }>;
}
