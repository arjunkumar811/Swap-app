'use client';

import { Settings } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

export default function SettingsPopover({ slippageBps, onSet }: { slippageBps: number; onSet: (v: number) => void }) {
  return (
    <Popover.Root>
      <Popover.Trigger className='rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10'><Settings size={16} /></Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className='z-50 w-52 rounded-xl border border-white/10 bg-[#111926] p-3 shadow-glass'>
          <p className='mb-2 text-xs text-muted'>Slippage tolerance</p>
          <div className='grid grid-cols-3 gap-2'>
            {[30, 50, 100].map((bps) => (
              <button key={bps} onClick={() => onSet(bps)} className={`rounded-lg px-2 py-2 text-xs ${slippageBps === bps ? 'bg-teal-400/20 text-teal-300' : 'bg-white/5 hover:bg-white/10'}`}>
                {(bps / 100).toFixed(2)}%
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}