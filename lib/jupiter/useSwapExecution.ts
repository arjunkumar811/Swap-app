'use client';

import { useCallback } from 'react';
import type { Connection, VersionedTransaction } from '@solana/web3.js';
import { useSwapStore } from '@/store/swapStore';
import { executeJupiterSwap } from './swap';
import { getErrorMessage } from './errors';

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
        options?.onError?.('No quote available');
        return;
      }

      try {
        s.setSwapping(true);
        s.setTxError(undefined);
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
        s.setTxError(getErrorMessage(error, 'Swap transaction failed'));
        options?.onError?.(getErrorMessage(error, 'Swap transaction failed'));
      } finally {
        s.setSwapping(false);
      }
    },
    [s.quote, s.setSwapping, s.setTxid, s.setTxStatus, s.setTxError, options]
  );

  return { executeSwap };
}
