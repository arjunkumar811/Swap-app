import { create } from 'zustand';
import type { Token } from '@/types/token';
import type { JupiterQuote } from '@/lib/jupiter';
import { sanitizeSlippageBps } from '@/lib/jupiter/slippage';

type SwapState = {
  inputToken?: Token;
  outputToken?: Token;
  amount: string;
  slippageBps: number;
  quote?: JupiterQuote;
  txid?: string;
  loadingQuote: boolean;
  swapping: boolean;
  setInputToken: (t: Token) => void;
  setOutputToken: (t: Token) => void;
  setAmount: (v: string) => void;
  setSlippageBps: (v: number) => void;
  setQuote: (q?: JupiterQuote) => void;
  setLoadingQuote: (v: boolean) => void;
  setSwapping: (v: boolean) => void;
  setTxid: (v?: string) => void;
  flipTokens: () => void;
};

export const useSwapStore = create<SwapState>((set) => ({
  amount: '',
  slippageBps: 50,
  loadingQuote: false,
  swapping: false,
  setInputToken: (inputToken) => set({ inputToken }),
  setOutputToken: (outputToken) => set({ outputToken }),
  setAmount: (amount) => set({ amount }),
  setSlippageBps: (slippageBps) => set({ slippageBps: sanitizeSlippageBps(slippageBps), quote: undefined }),
  setQuote: (quote) => set({ quote }),
  setLoadingQuote: (loadingQuote) => set({ loadingQuote }),
  setSwapping: (swapping) => set({ swapping }),
  setTxid: (txid) => set({ txid }),
  flipTokens: () => set((s) => ({ inputToken: s.outputToken, outputToken: s.inputToken, quote: undefined }))
}));
