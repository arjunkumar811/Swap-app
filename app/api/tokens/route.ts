import { NextResponse } from 'next/server';
import type { Token } from '@/types/token';
import { FALLBACK_TOKENS } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

const ENDPOINTS = [
  'https://quote-api.jup.ag/v6/tokens',
  'https://tokens.jup.ag/tokens?tags=verified',
  'https://token.jup.ag/all'
];
const REQUEST_TIMEOUT_MS = 4000;

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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) continue;
      const data = await res.json();
      const tokens = normalizeTokens(data);
      if (tokens.length > 0) return NextResponse.json(tokens);
    } catch {
      // Try next endpoint.
    } finally {
      clearTimeout(timeout);
    }
  }

  // Keep swap usable when upstream token APIs are down.
  return NextResponse.json(FALLBACK_TOKENS);
}
