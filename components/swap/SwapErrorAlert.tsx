'use client';

import type { SwapError } from '@/lib/jupiter/errors';

type Props = {
  error?: SwapError;
  onDismiss: () => void;
};

export default function SwapErrorAlert({ error, onDismiss }: Props) {
  if (!error) return null;

  return (
    <div className='rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-xs text-red-100'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <div className='font-semibold text-red-200'>Swap Error</div>
          <div>{error.message}</div>
        </div>
        <button onClick={onDismiss} className='rounded bg-white/10 px-2 py-1 text-[11px] hover:bg-white/20'>
          Dismiss
        </button>
      </div>
    </div>
  );
}
