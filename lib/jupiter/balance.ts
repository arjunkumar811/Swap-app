import { PublicKey, type Connection } from '@solana/web3.js';
import type { Token } from '@/types/token';
import { JupiterApiError } from './errors';
import { DEFAULT_MINTS } from '@/lib/tokens';

export type TokenBalanceResult = {
  amount: number;
  uiAmountString: string;
};

export async function fetchTokenBalance(params: {
  connection: Connection;
  owner: string;
  token: Token;
}): Promise<TokenBalanceResult> {
  const ownerKey = new PublicKey(params.owner);

  try {
    if (params.token.address === DEFAULT_MINTS.SOL) {
      const lamports = await params.connection.getBalance(ownerKey, 'confirmed');
      const amount = lamports / 10 ** params.token.decimals;
      return { amount, uiAmountString: amount.toFixed(6) };
    }

    const mint = new PublicKey(params.token.address);
    let amount = 0;

    try {
      // Preferred path: single parsed query for all token accounts by mint.
      const tokenAccounts = await params.connection.getParsedTokenAccountsByOwner(ownerKey, { mint });
      amount = tokenAccounts.value.reduce((sum, account) => {
        const info = account.account.data.parsed.info.tokenAmount;
        return sum + Number(info.uiAmount ?? 0);
      }, 0);
    } catch {
      // Fallback for RPC nodes that reject parsed token-account methods.
      const tokenAccounts = await params.connection.getTokenAccountsByOwner(ownerKey, { mint });
      for (const account of tokenAccounts.value) {
        const balance = await params.connection.getTokenAccountBalance(account.pubkey, 'confirmed');
        amount += Number(balance.value.uiAmount ?? 0);
      }
    }

    return { amount, uiAmountString: amount.toFixed(6) };
  } catch (error) {
    throw new JupiterApiError('Failed to fetch token balance', { details: error });
  }
}
