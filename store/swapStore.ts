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
  txStatus: 'idle' | 'signing' | 'submitting' | 'confirming' | 'success' | 'error';
  txError?: string;
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
  setTxStatus: (v: SwapState['txStatus']) => void;
  setTxError: (v?: string) => void;
  flipTokens: () => void;
};

export const useSwapStore = create<SwapState>((set) => ({
  amount: '',
  slippageBps: 50,
  txStatus: 'idle',
  loadingQuote: false,
  swapping: false,
  setInputToken: (inputToken) => set({ inputToken, txStatus: 'idle', txError: undefined }),
  setOutputToken: (outputToken) => set({ outputToken, txStatus: 'idle', txError: undefined }),
  setAmount: (amount) => set({ amount, txStatus: 'idle', txError: undefined }),
  setSlippageBps: (slippageBps) => set({ slippageBps: sanitizeSlippageBps(slippageBps), quote: undefined, txStatus: 'idle', txError: undefined }),
  setQuote: (quote) => set({ quote }),
  setLoadingQuote: (loadingQuote) => set({ loadingQuote }),
  setSwapping: (swapping) => set({ swapping }),
  setTxid: (txid) => set({ txid }),
  setTxStatus: (txStatus) => set({ txStatus }),
  setTxError: (txError) => set({ txError }),
  flipTokens: () => set((s) => ({ inputToken: s.outputToken, outputToken: s.inputToken, quote: undefined, txStatus: 'idle', txError: undefined }))
}));
