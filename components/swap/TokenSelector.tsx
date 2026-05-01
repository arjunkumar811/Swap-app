'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Star, PlusCircle } from 'lucide-react';
import type { Token } from '@/types/token';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const FAVORITES_KEY = 'swap.favoriteTokens';
const RECENTS_KEY = 'swap.recentTokens';
const CUSTOM_KEY = 'swap.customTokens';

function safeParse(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function loadCustomTokens(value: string | null): Token[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((token): token is Token =>
          token && typeof token === 'object' && typeof token.address === 'string' && typeof token.symbol === 'string'
        )
      : [];
  } catch {
    return [];
  }
}

function shortenAddress(address?: string) {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: Token[];
  selected?: Token;
  onSelect: (token: Token) => void;
};

export default function TokenSelector({ open, onOpenChange, tokens, selected, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [customTokens, setCustomTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setFavorites(safeParse(window.localStorage.getItem(FAVORITES_KEY)));
    setRecents(safeParse(window.localStorage.getItem(RECENTS_KEY)));
    setCustomTokens(loadCustomTokens(window.localStorage.getItem(CUSTOM_KEY)));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  }, [recents]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(customTokens));
  }, [customTokens]);

  const list = useMemo(() => [...customTokens, ...tokens], [customTokens, tokens]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list.slice(0, 200);
    return list
      .filter((token) => `${token.symbol} ${token.name} ${token.address}`.toLowerCase().includes(q))
      .slice(0, 200);
  }, [list, query]);

  const favoriteTokens = useMemo(
    () => list.filter((token) => favorites.includes(token.address)),
    [favorites, list]
  );

  const recentTokens = useMemo(
    () => list.filter((token) => recents.includes(token.address)),
    [recents, list]
  );

  const canImport = useMemo(() => {
    const q = query.trim();
    if (q.length < 32) return false;
    return !list.some((token) => token.address === q);
  }, [list, query]);

  function handleSelect(token: Token) {
    onSelect(token);
    setRecents((prev) => [token.address, ...prev.filter((item) => item !== token.address)].slice(0, 8));
    onOpenChange(false);
  }

  function toggleFavorite(token: Token) {
    setFavorites((prev) =>
      prev.includes(token.address)
        ? prev.filter((item) => item !== token.address)
        : [token.address, ...prev]
    );
  }

  function importToken() {
    const address = query.trim();
    if (!address) return;
    const custom: Token = {
      address,
      symbol: 'CUSTOM',
      name: 'Custom Token',
      decimals: 6
    };
    setCustomTokens((prev) => [custom, ...prev.filter((token) => token.address !== address)]);
    handleSelect(custom);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
          <DialogDescription>Search by symbol, name, or mint address.</DialogDescription>
        </DialogHeader>
        <div className='mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
          <Search size={18} className='text-white/60' />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search tokens...'
            className='h-auto border-none bg-transparent px-0 focus:ring-0'
          />
        </div>

        {favoriteTokens.length > 0 && (
          <div className='mt-4'>
            <div className='mb-2 text-xs uppercase tracking-[0.25em] text-white/50'>Favorites</div>
            <div className='flex flex-wrap gap-2'>
              {favoriteTokens.map((token) => (
                <button
                  key={token.address}
                  type='button'
                  onClick={() => handleSelect(token)}
                  className='flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10'
                >
                  <span>{token.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {recentTokens.length > 0 && (
          <div className='mt-4'>
            <div className='mb-2 text-xs uppercase tracking-[0.25em] text-white/50'>Recent</div>
            <div className='flex flex-wrap gap-2'>
              {recentTokens.map((token) => (
                <button
                  key={token.address}
                  type='button'
                  onClick={() => handleSelect(token)}
                  className='flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10'
                >
                  <span>{token.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className='mt-5 rounded-3xl border border-white/10 bg-black/30 p-2'>
          <ScrollArea className='h-[320px] pr-2'>
            <div className='space-y-1'>
              {filtered.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleSelect(token)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition hover:bg-white/10',
                    selected?.address === token.address && 'bg-white/10'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5'>
                      {token.logoURI ? (
                        <img src={token.logoURI} alt={token.symbol} className='h-6 w-6 rounded-full' />
                      ) : (
                        <span className='text-xs font-semibold text-white/60'>{token.symbol[0]}</span>
                      )}
                    </div>
                    <div>
                      <div className='text-sm font-semibold text-white'>{token.symbol}</div>
                      <div className='text-xs text-white/50'>{token.name}</div>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Badge variant='subtle'>{shortenAddress(token.address)}</Badge>
                    <button
                      type='button'
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(token);
                      }}
                      className={cn(
                        'rounded-full border border-white/10 p-1 text-white/50 hover:text-white',
                        favorites.includes(token.address) && 'border-amber-400/40 text-amber-300'
                      )}
                    >
                      <Star size={14} className={favorites.includes(token.address) ? 'fill-amber-400/60' : ''} />
                    </button>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className='rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/70'>
                  No tokens found for this search.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {canImport && (
          <button
            type='button'
            onClick={importToken}
            className='mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm text-white/80 hover:bg-white/10'
          >
            <PlusCircle size={16} /> Import custom token
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
