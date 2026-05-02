'use client';

import { ReactNode, createElement, useMemo, type ComponentType } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import '@solana/wallet-adapter-react-ui/styles.css';

export function SolanaProviders({ children }: { children: ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  const wallets = useMemo(() => {
    const adapters: WalletAdapter[] = [];
    try {
      adapters.push(new PhantomWalletAdapter());
    } catch (error) {
      console.error('Failed to initialize Phantom adapter', error);
    }
    try {
      adapters.push(new SolflareWalletAdapter());
    } catch (error) {
      console.error('Failed to initialize Solflare adapter', error);
    }
    return adapters;
  }, []);

  return createElement(
    ConnectionProvider as unknown as ComponentType<{ endpoint: string; children?: ReactNode }>,
    { endpoint },
    createElement(
      WalletProvider as unknown as ComponentType<{ wallets: WalletAdapter[]; autoConnect: boolean; children?: ReactNode }>,
      { wallets, autoConnect: true },
      createElement(WalletModalProvider, null, children)
    )
  );
}
