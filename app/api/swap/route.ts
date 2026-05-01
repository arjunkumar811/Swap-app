import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ENDPOINTS = [
  'https://quote-api.jup.ag/v6/swap',
  'https://lite-api.jup.ag/swap/v1/swap'
];

export async function POST(req: NextRequest) {
  const payload = await req.json();

  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data && data.swapTransaction) return NextResponse.json(data);
    } catch {
      // Try next endpoint.
    }
  }

  return NextResponse.json({ error: 'Failed to build swap transaction' }, { status: 502 });
}
