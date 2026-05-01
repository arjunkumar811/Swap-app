'use client';

import { useEffect } from 'react';
import { getErrorMessage } from './errors';
import { fetchJupiterQuote } from './quote';
import { useSwapStore } from '@/store/swapStore';

type UseQuoteOptions = {
  onError?: (message: string) => void;
};

export function useQuote(options?: UseQuoteOptions) {
  const s = useSwapStore();

  useEffect(() => {
    if (!s.inputToken || !s.outputToken || !Number(s.amount)) {
      s.setQuote(undefined);
      return;
    }
    const inputToken = s.inputToken;
    const outputToken = s.outputToken;

    const timeout = setTimeout(async () => {
      try {
        s.setLoadingQuote(true);
        const rawAmount = Math.floor(Number(s.amount) * 10 ** inputToken.decimals).toString();
        const quote = await fetchJupiterQuote({
          inputMint: inputToken.address,
          outputMint: outputToken.address,
          amount: rawAmount,
          slippageBps: s.slippageBps
        });
        s.setQuote(quote);
      } catch (error) {
        s.setQuote(undefined);
        s.setTxid(undefined);
        options?.onError?.(getErrorMessage(error, 'Quote failed'));
      } finally {
        s.setLoadingQuote(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [s.amount, s.inputToken?.address, s.outputToken?.address, s.slippageBps]);
}
