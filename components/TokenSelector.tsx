'use client';

import { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Token } from '@/types/token';

export default function TokenSelector({ tokens, selected, onSelect, label, loading }: { tokens: Token[]; selected?: Token; onSelect: (t: Token) => void; label: string; loading?: boolean; }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => tokens.filter((t) => `${t.symbol} ${t.name}`.toLowerCase().includes(query.toLowerCase())).slice(0, 200), [tokens, query]);
  return (
    <>
      <div className='flex items-center justify-between text-xs text-muted'><span>{label}</span></div>
      <button onClick={() => setOpen(true)} className='mt-2 flex h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 hover:bg-white/[0.06]'>
        <span className='text-lg font-semibold text-white/80'>{selected ? `${selected.symbol} · ${selected.name}` : loading ? 'Loading tokens...' : 'Select token'}</span>
      </button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/60' />
          <Dialog.Content className='fixed left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-blue-200/20 bg-[#08142a]/95 p-5 shadow-2xl'>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search token by symbol or name' className='mb-3 h-14 w-full rounded-2xl border border-blue-100/20 bg-white/5 px-4 text-3xl outline-none placeholder:text-white/50' />
            <div className='max-h-80 overflow-y-auto space-y-1'>
              {filtered.map((t) => <button key={t.address} onClick={() => { onSelect(t); setOpen(false); }} className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/10'><span>{t.symbol}</span><span className='text-xs text-muted'>{t.name}</span></button>)}
              {!loading && filtered.length === 0 && <div className='rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/70'>No tokens found</div>}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
