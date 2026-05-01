import { NextResponse } from 'next/server';
import type { Token } from '@/types/token';

export const dynamic = 'force-dynamic';

const ENDPOINTS = [
  'https://quote-api.jup.ag/v6/tokens',
  'https://tokens.jup.ag/tokens?tags=verified',
  'https://token.jup.ag/all'
];

function normalizeTokens(data: unknown): Token[] {
  if (Array.isArray(data)) return data as Token[];
  if (data && typeof data === 'object') {
    const values = Object.values(data);
    if (values.length > 0) return values as Token[];
  }
  return [];
}

export async function GET() {
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      const tokens = normalizeTokens(data);
      if (tokens.length > 0) return NextResponse.json(tokens);
    } catch {
      // Try next endpoint.
    }
  }

  return NextResponse.json({ error: 'Failed to fetch token list' }, { status: 502 });
}
