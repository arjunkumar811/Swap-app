'use client';

type Props = { value: string; onChange: (v: string) => void; balanceText?: string; label?: string };

export default function AmountInput({ value, onChange, balanceText, label = 'Amount' }: Props) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-sm text-muted'><span>{label}</span><span>{balanceText || '-'}</span></div>
      <input
        className='w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-5xl font-semibold outline-none transition focus:border-teal-300/60'
        placeholder='0'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
