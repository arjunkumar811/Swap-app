'use client';

import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type='button'
        className='h-11 rounded-2xl bg-white/10 px-4 text-sm text-white/80'
        disabled
      >
        Connect Wallet
      </button>
    );
  }

  return <WalletMultiButton className='!h-11 !rounded-2xl !bg-white/10 !px-4 !text-sm hover:!bg-white/20' />;
}
