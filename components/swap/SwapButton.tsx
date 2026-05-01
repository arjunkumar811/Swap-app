'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  label?: string;
  className?: string;
};

export default function SwapButton({ onClick, disabled, loading, label = 'Swap', className }: Props) {
  return (
    <motion.div whileHover={{ scale: disabled ? 1 : 1.01 }} whileTap={{ scale: disabled ? 1 : 0.99 }}>
      <Button
        onClick={onClick}
        disabled={disabled}
        size='lg'
        className={cn('w-full rounded-2xl text-base shadow-[0_12px_35px_rgba(56,189,248,0.3)]', className)}
      >
        {loading ? 'Processing...' : label}
      </Button>
    </motion.div>
  );
}
