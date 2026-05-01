export class JupiterApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, options?: { status?: number; details?: unknown }) {
    super(message);
    this.name = 'JupiterApiError';
    this.status = options?.status;
    this.details = options?.details;
  }
}

export type SwapErrorCode =
  | 'WALLET_NOT_CONNECTED'
  | 'QUOTE_FAILED'
  | 'SWAP_FAILED'
  | 'TOKEN_LIST_FAILED'
  | 'BALANCE_FAILED'
  | 'UNKNOWN';

export type SwapError = {
  code: SwapErrorCode;
  message: string;
  recoverable: boolean;
  source: 'wallet' | 'quote' | 'swap' | 'tokens' | 'balance' | 'unknown';
};

function extractErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  return undefined;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof JupiterApiError) {
    const detailMessage = extractErrorMessage(error.details);
    if (detailMessage) return detailMessage;
  }

  const message = extractErrorMessage(error);
  return message ?? fallback;
}

export function toSwapError(
  error: unknown,
  fallback: string,
  defaults?: Partial<Pick<SwapError, 'code' | 'recoverable' | 'source'>>
): SwapError {
  return {
    code: defaults?.code ?? 'UNKNOWN',
    message: getErrorMessage(error, fallback),
    recoverable: defaults?.recoverable ?? true,
    source: defaults?.source ?? 'unknown'
  };
}
