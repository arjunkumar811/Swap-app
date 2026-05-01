'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import type { Token } from '@/types/token';
import { useTokenSearch } from './useTokenSearch';

type TokenSelectorProps = {
  tokens: Token[];
  selected?: Token;
  onSelect: (token: Token) => void;
  label: string;
  loading?: boolean;
  disabled?: boolean;
};

function TokenSelectorSkeleton() {
  return (
    <div className='space-y-2'>
      <div className='h-4 w-24 animate-pulse rounded bg-white/10' />
      <div className='h-12 w-full animate-pulse rounded-2xl bg-white/10' />
    </div>
  );
}

export default function TokenSelector({
  tokens,
  selected,
  onSelect,
  label,
  loading = false,
  disabled = false
}: TokenSelectorProps) {
  const { query, setQuery, filteredTokens } = useTokenSearch(tokens);

  if (loading) return <TokenSelectorSkeleton />;

  return (
    <Dialog.Root>
      <div className='flex items-center justify-between text-xs text-muted'>
        <span>{label}</span>
      </div>
      <Dialog.Trigger
        disabled={disabled}
        className='mt-2 flex h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-left hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60'
      >
        <span className='text-lg font-semibold text-white/80'>
          {selected ? `${selected.symbol} · ${selected.name}` : 'Select token'}
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-40 bg-black/60' />
        <Dialog.Content className='fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-blue-200/20 bg-[#08142a]/95 p-5 shadow-2xl'>
          <div className='mb-3 flex h-14 items-center gap-2 rounded-2xl border border-blue-100/20 bg-white/5 px-4'>
            <Search size={18} className='text-white/60' />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search by symbol, name, or mint address'
              className='h-full w-full bg-transparent text-base outline-none placeholder:text-white/50'
            />
          </div>
          <div className='max-h-80 space-y-1 overflow-y-auto'>
            {filteredTokens.map((token) => (
              <Dialog.Close asChild key={token.address}>
                <button
                  onClick={() => onSelect(token)}
                  className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/10'
                >
                  <span>{token.symbol}</span>
                  <span className='text-xs text-muted'>{token.name}</span>
                </button>
              </Dialog.Close>
            ))}
            {filteredTokens.length === 0 && (
              <div className='rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/70'>
                No tokens found for this search.
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
