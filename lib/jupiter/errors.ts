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

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
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
