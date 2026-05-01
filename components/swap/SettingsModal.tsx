'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  bpsToPercentLabel,
  isValidSlippageBps,
  MAX_SLIPPAGE_BPS,
  MIN_SLIPPAGE_BPS,
  parsePercentToBps,
  SLIPPAGE_PRESET_BPS
} from '@/lib/jupiter/slippage';

const DEADLINE_MIN = 1;
const DEADLINE_MAX = 30;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slippageBps: number;
  onSlippageChange: (value: number) => void;
  deadlineMinutes: number;
  onDeadlineChange: (value: number) => void;
  priorityFee: boolean;
  onPriorityFeeChange: (value: boolean) => void;
};

export default function SettingsModal({
  open,
  onOpenChange,
  slippageBps,
  onSlippageChange,
  deadlineMinutes,
  onDeadlineChange,
  priorityFee,
  onPriorityFeeChange
}: Props) {
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
    onSlippageChange(customBps);
  }

  function updateDeadline(raw: string) {
    const next = Number(raw);
    if (!Number.isFinite(next)) return;
    const clamped = Math.min(DEADLINE_MAX, Math.max(DEADLINE_MIN, Math.round(next)));
    onDeadlineChange(clamped);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Fine-tune slippage and execution preferences.</DialogDescription>
        </DialogHeader>

        <div className='mt-4 space-y-4'>
          <div>
            <Label>Slippage tolerance</Label>
            <div className='mt-2 grid grid-cols-3 gap-2'>
              {SLIPPAGE_PRESET_BPS.map((bps) => (
                <Button
                  key={bps}
                  type='button'
                  variant={slippageBps === bps ? 'primary' : 'secondary'}
                  size='sm'
                  onClick={() => onSlippageChange(bps)}
                >
                  {bpsToPercentLabel(bps)}%
                </Button>
              ))}
            </div>
            <div className='mt-3 flex items-center gap-2'>
              <Input
                value={customValue}
                onChange={(event) => setCustomValue(event.target.value)}
                placeholder='0.50'
                className='h-10'
              />
              <Button type='button' variant='secondary' size='sm' onClick={applyCustomSlippage} disabled={Boolean(customError)}>
                Set
              </Button>
            </div>
            <p className='mt-2 text-[11px] text-white/50'>
              {customError ? customError : `Current: ${bpsToPercentLabel(slippageBps)}%`}
            </p>
          </div>

          <div>
            <Label>Transaction deadline (minutes)</Label>
            <div className='mt-2 flex items-center gap-2'>
              <Input
                value={deadlineMinutes}
                onChange={(event) => updateDeadline(event.target.value)}
                className='h-10'
              />
              <span className='text-xs text-white/50'>1-30</span>
            </div>
          </div>

          <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
            <div>
              <div className='text-sm font-semibold text-white'>Priority fee</div>
              <div className='text-xs text-white/50'>Boost confirmation during network congestion.</div>
            </div>
            <Switch checked={priorityFee} onCheckedChange={onPriorityFeeChange} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
