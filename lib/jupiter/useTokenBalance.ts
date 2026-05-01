'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Connection } from '@solana/web3.js';
import type { Token } from '@/types/token';
import { fetchTokenBalance } from './balance';
import { getErrorMessage } from './errors';

type UseTokenBalanceParams = {
  connection: Connection;
  owner?: string;
  token?: Token;
};

type UseTokenBalanceResult = {
  balance?: number;
  balanceText: string;
  loading: boolean;
  error?: string;
};

export function useTokenBalance({
  connection,
  owner,
  token
}: UseTokenBalanceParams): UseTokenBalanceResult {
  const [balance, setBalance] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!owner || !token) {
      setBalance(undefined);
      setError(undefined);
      setLoading(false);
      return;
    }
    const ownerAddress = owner;
    const selectedToken = token;

    let active = true;

    async function loadBalance() {
      setLoading(true);
      setError(undefined);
      try {
        const result = await fetchTokenBalance({
          connection,
          owner: ownerAddress,
          token: selectedToken
        });
        if (!active) return;
        setBalance(result.amount);
      } catch (err) {
        if (!active) return;
        setBalance(undefined);
        setError(getErrorMessage(err, 'Failed to fetch token balance'));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBalance();
    const id = window.setInterval(loadBalance, 15000);

    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [connection, owner, token?.address]);

  const balanceText = useMemo(() => {
    if (!owner) return 'Wallet not connected';
    if (!token) return '-';
    if (loading) return 'Balance: Loading...';
    if (error) return 'Balance unavailable';
    if (balance === undefined) return '-';
    return `Balance: ${balance.toFixed(6)} ${token.symbol}`;
  }, [owner, token?.symbol, loading, error, balance]);

  return { balance, balanceText, loading, error };
}
