'use client';

import { useMemo, useState } from 'react';
import type { Token } from '@/types/token';

export function useTokenSearch(tokens: Token[]) {
  const [query, setQuery] = useState('');

  const filteredTokens = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens.slice(0, 200);
    return tokens
      .filter((token) =>
        `${token.symbol} ${token.name} ${token.address}`.toLowerCase().includes(q)
      )
      .slice(0, 200);
  }, [tokens, query]);

  return { query, setQuery, filteredTokens };
}
