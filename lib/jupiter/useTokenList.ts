'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Token } from '@/types/token';
import { DEFAULT_MINTS, FALLBACK_TOKENS } from '@/lib/tokens';
import { fetchJupiterTokens } from './tokens';
import { getErrorMessage } from './errors';

type UseTokenListResult = {
  tokens: Token[];
  loading: boolean;
  error?: string;
  inputDefault?: Token;
  outputDefault?: Token;
};

export function useTokenList(): UseTokenListResult {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(undefined);
      try {
        const list = await fetchJupiterTokens();
        if (!active) return;
        setTokens(list);
      } catch (err) {
        if (!active) return;
        setTokens(FALLBACK_TOKENS);
        setError(getErrorMessage(err, 'Using fallback token list'));
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const inputDefault = useMemo(
    () => tokens.find((x) => x.address === DEFAULT_MINTS.SOL) ?? tokens[0],
    [tokens]
  );
  const outputDefault = useMemo(
    () => tokens.find((x) => x.address === DEFAULT_MINTS.USDC) ?? tokens[1] ?? tokens[0],
    [tokens]
  );

  return { tokens, loading, error, inputDefault, outputDefault };
}
