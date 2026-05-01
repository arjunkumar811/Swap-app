import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';
import { SolanaProviders } from '@/components/SolanaProviders';
import { Toaster } from 'sonner';

const sora = Sora({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solana Jupiter Swap',
  description: 'Production-grade Solana swap UI powered by Jupiter v6'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark'>
      <body className={sora.className}>
        <SolanaProviders>
          {children}
          <Toaster richColors position='top-right' />
        </SolanaProviders>
      </body>
    </html>
  );
}