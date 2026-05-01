import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ENDPOINTS = [
  'https://quote-api.jup.ag/v6/quote',
  'https://lite-api.jup.ag/swap/v1/quote'
];

export async function GET(req: NextRequest) {
  const inputMint = req.nextUrl.searchParams.get('inputMint');
  const outputMint = req.nextUrl.searchParams.get('outputMint');
  const amount = req.nextUrl.searchParams.get('amount');
  const slippageBps = req.nextUrl.searchParams.get('slippageBps') || '50';

  if (!inputMint || !outputMint || !amount) {
    return NextResponse.json({ error: 'Missing quote parameters' }, { status: 400 });
  }

  const params = new URLSearchParams({ inputMint, outputMint, amount, slippageBps });

  for (const base of ENDPOINTS) {
    try {
      const res = await fetch(`${base}?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      if (data && data.outAmount) return NextResponse.json(data);
    } catch {
      // Try next endpoint.
    }
  }

  return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 502 });
}
