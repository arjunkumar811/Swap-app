'use client';

import { motion } from 'framer-motion';

export default function SwapButton({ onClick, disabled, loading }: { onClick: () => void; disabled: boolean; loading: boolean }) {
  return (
    <motion.button whileHover={{ scale: disabled ? 1 : 1.01 }} whileTap={{ scale: disabled ? 1 : 0.99 }} onClick={onClick} disabled={disabled}
      className='h-11 w-full rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40'>
      {loading ? 'Swapping...' : 'Swap'}
    </motion.button>
  );
}