'use client';

import { Settings } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useEffect, useMemo, useState } from 'react';
import {
  bpsToPercentLabel,
  isValidSlippageBps,
  MAX_SLIPPAGE_BPS,
  MIN_SLIPPAGE_BPS,
  parsePercentToBps,
  SLIPPAGE_PRESET_BPS
} from '@/lib/jupiter/slippage';

export default function SettingsPopover({ slippageBps, onSet }: { slippageBps: number; onSet: (v: number) => void }) {
  const [customValue, setCustomValue] = useState(bpsToPercentLabel(slippageBps));
  useEffect(() => {
    setCustomValue(bpsToPercentLabel(slippageBps));
  }, [slippageBps]);

  const customBps = useMemo(() => parsePercentToBps(customValue), [customValue]);
  const customError = useMemo(() => {
    if (!customValue.trim()) return 'Enter custom slippage';
    if (customBps === undefined) return 'Enter a valid number';
    if (!isValidSlippageBps(customBps)) {
      return `Allowed range: ${(MIN_SLIPPAGE_BPS / 100).toFixed(2)}% - ${(MAX_SLIPPAGE_BPS / 100).toFixed(2)}%`;
    }
    return undefined;
  }, [customBps, customValue]);

  function applyCustomSlippage() {
    if (customBps === undefined || !isValidSlippageBps(customBps)) return;
    onSet(customBps);
  }

  return (
    <Popover.Root>
      <Popover.Trigger className='rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10'><Settings size={16} /></Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className='z-50 w-64 rounded-xl border border-white/10 bg-[#111926] p-3 shadow-glass'>
          <p className='mb-2 text-xs text-muted'>Slippage tolerance</p>
          <div className='grid grid-cols-3 gap-2'>
            {SLIPPAGE_PRESET_BPS.map((bps) => (
              <button key={bps} onClick={() => onSet(bps)} className={`rounded-lg px-2 py-2 text-xs ${slippageBps === bps ? 'bg-teal-400/20 text-teal-300' : 'bg-white/5 hover:bg-white/10'}`}>
                {bpsToPercentLabel(bps)}%
              </button>
            ))}
          </div>
          <div className='mt-3 space-y-2'>
            <label className='block text-xs text-muted'>Custom (%)</label>
            <div className='flex gap-2'>
              <input
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder='0.50'
                className='h-9 w-full rounded-lg border border-white/10 bg-white/5 px-2 text-sm outline-none focus:border-teal-300/60'
              />
              <button
                onClick={applyCustomSlippage}
                disabled={Boolean(customError)}
                className='rounded-lg bg-teal-400/20 px-3 text-xs text-teal-200 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Set
              </button>
            </div>
            {customError ? (
              <p className='text-[11px] text-amber-300'>{customError}</p>
            ) : (
              <p className='text-[11px] text-teal-200'>Current: {bpsToPercentLabel(slippageBps)}%</p>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
