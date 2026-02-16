import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const inputMint = searchParams.get('inputMint');
  const outputMint = searchParams.get('outputMint');
  const amount = searchParams.get('amount');
  const slippageBps = searchParams.get('slippageBps') || '50';

  if (!inputMint || !outputMint || !amount) {
    return NextResponse.json({ error: 'Missing inputMint/outputMint/amount' }, { status: 400 });
  }

  const url = new URL('https://quote-api.jup.ag/v6/quote');
  url.searchParams.set('inputMint', inputMint);
  url.searchParams.set('outputMint', outputMint);
  url.searchParams.set('amount', amount);
  url.searchParams.set('slippageBps', slippageBps);

  try {
    const res = await fetch(url.toString(), {
      headers: { 'accept': 'application/json' },
      // prevent Next from caching
      cache: 'no-store'
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: json?.error || 'Quote API error', details: json }, { status: 502 });
    }

    return NextResponse.json(json, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch quote', details: String(e?.message || e) }, { status: 502 });
  }
}
