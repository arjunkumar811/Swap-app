import { VersionedTransaction, type Connection } from '@solana/web3.js';
import type { JupiterQuote } from './quote';
import { JupiterApiError } from './errors';

export type CreateSwapTxPayload = {
  quoteResponse: JupiterQuote;
  userPublicKey: string;
  wrapAndUnwrapSol?: boolean;
};

export type CreateSwapTxResponse = {
  swapTransaction: string;
};

export type SwapExecutionParams = {
  connection: Connection;
  quote: JupiterQuote;
  userPublicKey: string;
  signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction>;
  wrapAndUnwrapSol?: boolean;
};

export async function createSwapTransaction(
  payload: CreateSwapTxPayload
): Promise<CreateSwapTxResponse> {
  let res: Response;
  try {
    res = await fetch('/api/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw new JupiterApiError('Network error while building swap transaction', { details: error });
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new JupiterApiError('Invalid swap response format', { status: res.status });
  }

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : 'Failed to build swap transaction';
    throw new JupiterApiError(message, { status: res.status, details: data });
  }

  if (
    !data ||
    typeof data !== 'object' ||
    !('swapTransaction' in data) ||
    typeof data.swapTransaction !== 'string'
  ) {
    throw new JupiterApiError('Swap response missing swapTransaction', {
      status: res.status,
      details: data
    });
  }

  return data as CreateSwapTxResponse;
}

export async function executeJupiterSwap(params: SwapExecutionParams): Promise<{ signature: string }> {
  const { swapTransaction } = await createSwapTransaction({
    quoteResponse: params.quote,
    userPublicKey: params.userPublicKey,
    wrapAndUnwrapSol: params.wrapAndUnwrapSol ?? true
  });

  let tx: VersionedTransaction;
  try {
    tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
  } catch (error) {
    throw new JupiterApiError('Unable to deserialize swap transaction', { details: error });
  }

  const signed = await params.signTransaction(tx);
  const signature = await params.connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    maxRetries: 2
  });
  await params.connection.confirmTransaction(signature, 'confirmed');
  return { signature };
}
