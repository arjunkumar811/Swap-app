'use client';

import { useCallback } from 'react';
import type { Connection, VersionedTransaction } from '@solana/web3.js';
import { useSwapStore } from '@/store/swapStore';
import { executeJupiterSwap } from './swap';
import { getErrorMessage, toSwapError } from './errors';

type UseSwapExecutionOptions = {
  onSuccess?: (signature: string) => void;
  onError?: (message: string) => void;
};

type ExecuteSwapInput = {
  connection: Connection;
  userPublicKey: string;
  signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction>;
};

export function useSwapExecution(options?: UseSwapExecutionOptions) {
  const s = useSwapStore();

  const executeSwap = useCallback(
    async ({ connection, userPublicKey, signTransaction }: ExecuteSwapInput) => {
      if (!s.quote) {
        s.setLastError(
          toSwapError(new Error('No quote available'), 'No quote available', {
            code: 'QUOTE_FAILED',
            source: 'quote'
          })
        );
        options?.onError?.('No quote available');
        return;
      }

      try {
        s.setSwapping(true);
        s.setTxError(undefined);
        s.clearLastError();
        s.setTxStatus('signing');
        const { signature } = await executeJupiterSwap({
          connection,
          quote: s.quote,
          userPublicKey,
          signTransaction,
          wrapAndUnwrapSol: true,
          onStatus: (status) => s.setTxStatus(status)
        });
        s.setTxid(signature);
        s.setTxStatus('success');
        options?.onSuccess?.(signature);
      } catch (error) {
        s.setTxStatus('error');
        const message = getErrorMessage(error, 'Swap transaction failed');
        s.setTxError(message);
        s.setLastError(
          toSwapError(error, 'Swap transaction failed', {
            code: 'SWAP_FAILED',
            source: 'swap'
          })
        );
        options?.onError?.(message);
      } finally {
        s.setSwapping(false);
      }
    },
    [s.quote, s.setSwapping, s.setTxid, s.setTxStatus, s.setTxError, s.setLastError, s.clearLastError, options]
  );

  return { executeSwap };
}
