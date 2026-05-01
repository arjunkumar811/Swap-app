export const DEFAULT_MINTS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
};

export const FALLBACK_TOKENS = [
  { address: DEFAULT_MINTS.SOL, symbol: 'SOL', name: 'Solana', decimals: 9 },
  { address: DEFAULT_MINTS.USDC, symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { address: 'Es9vMFrzaCER8fQf6zJ9n4J2V4nQxNfY7F3XGzdhjN1', symbol: 'USDT', name: 'Tether USD', decimals: 6 },
  { address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', symbol: 'JUP', name: 'Jupiter', decimals: 6 },
  { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', name: 'Bonk', decimals: 5 }
];
