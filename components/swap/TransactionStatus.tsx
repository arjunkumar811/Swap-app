'use client';

import { Copy, ExternalLink, Loader2 } from 'lucide-react';

type TxStatus = 'idle' | 'signing' | 'submitting' | 'confirming' | 'success' | 'error';

type Props = {
  status: TxStatus;
  txid?: string;
  error?: string;
};

const statusLabel: Record<Exclude<TxStatus, 'idle'>, string> = {
  signing: 'Awaiting wallet signature',
  submitting: 'Submitting transaction',
  confirming: 'Confirming on-chain',
  success: 'Transaction confirmed',
  error: 'Transaction failed'
};

export default function TransactionStatus({ status, txid, error }: Props) {
  if (status === 'idle') return null;

  const isPending = status === 'signing' || status === 'submitting' || status === 'confirming';
  const toneClass =
    status === 'success'
      ? 'border-teal-400/30 bg-teal-400/10 text-teal-200'
      : status === 'error'
        ? 'border-red-400/30 bg-red-400/10 text-red-200'
        : 'border-blue-400/30 bg-blue-400/10 text-blue-200';

  return (
    <div className={`rounded-xl border p-3 text-xs ${toneClass}`}>
      <div className='mb-2 flex items-center gap-2'>
        {isPending && <Loader2 size={14} className='animate-spin' />}
        <span>{statusLabel[status as Exclude<TxStatus, 'idle'>]}</span>
      </div>
      {error && status === 'error' && <div className='mb-2 text-[11px] text-red-100/90'>{error}</div>}
      {txid && (
        <div className='flex items-center gap-2'>
          <button onClick={() => navigator.clipboard.writeText(txid)} className='rounded bg-white/10 p-1'>
            <Copy size={14} />
          </button>
          <a className='inline-flex items-center gap-1 hover:underline' href={`https://solscan.io/tx/${txid}`} target='_blank'>
            View <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
