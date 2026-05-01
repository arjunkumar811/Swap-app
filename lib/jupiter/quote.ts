import { JupiterApiError } from './errors';

export type JupiterRoutePlanStep = {
  swapInfo: {
    label: string;
    feeAmount: string;
    feeMint: string;
  };
};

export type JupiterQuote = {
  inAmount: string;
  outAmount: string;
  priceImpactPct: string;
  routePlan: JupiterRoutePlanStep[];
};

export type FetchQuoteParams = {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps: number;
};

function isJupiterQuote(value: unknown): value is JupiterQuote {
  if (!value || typeof value !== 'object') return false;
  const quote = value as Partial<JupiterQuote>;
  return (
    typeof quote.inAmount === 'string' &&
    typeof quote.outAmount === 'string' &&
    typeof quote.priceImpactPct === 'string' &&
    Array.isArray(quote.routePlan)
  );
}

export async function fetchJupiterQuote(params: FetchQuoteParams): Promise<JupiterQuote> {
  const search = new URLSearchParams({
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
    slippageBps: String(params.slippageBps)
  });

  let res: Response;
  try {
    res = await fetch(`/api/quote?${search.toString()}`, { cache: 'no-store' });
  } catch (error) {
    throw new JupiterApiError('Network error while fetching quote', { details: error });
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new JupiterApiError('Invalid quote response format', { status: res.status });
  }

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : 'Failed to fetch quote';
    throw new JupiterApiError(message, { status: res.status, details: data });
  }

  if (!isJupiterQuote(data)) {
    throw new JupiterApiError('Quote response is missing required fields', {
      status: res.status,
      details: data
    });
  }

  return data;
}
