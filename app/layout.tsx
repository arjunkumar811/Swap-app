import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SolanaProviders } from '@/components/SolanaProviders';
import { Toaster } from 'sonner';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solana Jupiter Swap',
  description: 'Production-grade Solana swap UI powered by Jupiter v6'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark'>
      <body className={spaceGrotesk.className}>
        <SolanaProviders>
          {children}
          <Toaster richColors position='top-right' />
        </SolanaProviders>
      </body>
    </html>
  );
}