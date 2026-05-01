import { Connection } from '@solana/web3.js';

export const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
export const connection = new Connection(SOLANA_RPC, 'confirmed');