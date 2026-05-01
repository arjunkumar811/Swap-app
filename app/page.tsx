import SwapCard from '@/components/SwapCard';

export default function Page() {
  return (
    <main className='relative grid min-h-screen place-items-center p-4 md:p-8'>
      <div className='pointer-events-none absolute inset-0 nebula-bg' />
      <SwapCard />
    </main>
  );
}
