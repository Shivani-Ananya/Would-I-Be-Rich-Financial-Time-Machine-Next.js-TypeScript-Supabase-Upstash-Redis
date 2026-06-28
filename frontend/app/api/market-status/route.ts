import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  let lastFetched = new Date().toISOString();
  let status = 'live';

  if (redis) {
    try {
      const cached = await redis.get<string>('market_data_last_fetched');
      if (cached) {
        lastFetched = cached;
        status = 'cached';
      } else {
        // Seed if missing
        await redis.set('market_data_last_fetched', lastFetched);
      }
    } catch (err) {
      console.warn('[redis] Failed to fetch market status from cache, using local time:', err);
    }
  }

  return NextResponse.json({
    lastFetched,
    status,
  });
}
