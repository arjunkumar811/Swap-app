import SwapCard from '@/components/swap/SwapCard';
import SwapInsights from '@/components/swap/SwapInsights';

export default function Page() {
  return (
    <main className='relative min-h-screen overflow-hidden px-4 pb-16 pt-12 md:px-10'>
      <div className='pointer-events-none absolute inset-0 scene-bg' />
      <div className='pointer-events-none absolute inset-0 grid-overlay' />
      <div className='pointer-events-none absolute -right-32 top-12 h-[520px] w-[520px] rounded-full blur-3xl glow-orb' />
      <div className='relative mx-auto flex w-full max-w-6xl flex-col gap-12'>
        <section className='text-center md:text-left'>
          <span className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70'>
            Production grade
          </span>
          <h1 className='mt-6 text-4xl font-semibold tracking-tight text-white md:text-6xl'>
            Swap anytime, anywhere.
          </h1>
          <p className='mt-4 max-w-2xl text-base text-white/70 md:text-lg'>
            Premium liquidity routing, real-time price impact, and a refined execution flow built for serious traders.
          </p>
          <div className='mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/70 md:justify-start'>
            <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Live routes</span>
            <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Smart slippage</span>
            <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>Fast execution</span>
          </div>
        </section>

        <div className='grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start'>
          <SwapCard />
          <SwapInsights />
        </div>
      </div>
    </main>
  );
}
