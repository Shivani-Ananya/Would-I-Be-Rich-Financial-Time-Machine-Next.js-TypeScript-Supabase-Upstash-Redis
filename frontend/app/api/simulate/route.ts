import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/redis';
import { runSimulation, SimulationParams } from '@/lib/simulationEngine';

// ─── Input Validation Schema ─────────────────────────────────────────────────
const SimulateRequestSchema = z.object({
  scenarioId: z.string().min(1, 'scenarioId is required'),
  investmentType: z.enum(['lump_sum', 'recurring_dca', 'real_estate', 'inflation']),
  amount: z.number().positive('amount must be positive'),
  frequency: z.enum(['daily', 'monthly', 'yearly']),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid startDate format',
  }),
  currency: z.enum(['USD', 'INR']),
});

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    // 1. Validate Input
    const body = await request.json();
    const validation = SimulateRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: validation.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const params: SimulationParams = validation.data;

    // 2. Check Cache (Upstash Redis)
    const cacheKey = `sim:${params.scenarioId}:${params.investmentType}:${params.amount}:${params.frequency}:${params.startDate}:${params.currency}`;
    
    if (redis) {
      try {
        const cachedResult = await redis.get(cacheKey);
        if (cachedResult) {
          return NextResponse.json({
            success: true,
            data: cachedResult,
            cached: true,
          });
        }
      } catch (cacheError) {
        console.error('[redis] Cache read error:', cacheError);
        // Continue without caching on Redis failure
      }
    }

    // 3. Fetch Scenario Category from Supabase
    let category = 'stocks'; // Fallback category if database is unconfigured
    
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url-here';

    if (isSupabaseConfigured) {
      try {
        // Query both id and uuid columns to be compatible with different UUID scenarios
        const { data: scenario, error } = await supabase
          .from('scenarios')
          .select('category')
          .or(`id.eq.${params.scenarioId}`)
          .single();

        if (error) {
          console.warn('[supabase] Scenario fetch warning:', error.message);
        } else if (scenario) {
          category = scenario.category;
        }
      } catch (dbError) {
        console.error('[supabase] Database fetch error:', dbError);
        // Continue using default fallback category to remain functional
      }
    }

    // 4. Run calculations
    // @ts-ignore
    const result = runSimulation(category, params);

    // 5. Save to Cache
    if (redis) {
      try {
        await redis.set(cacheKey, result, { ex: 86400 }); // 24-hour TTL
      } catch (cacheError) {
        console.error('[redis] Cache write error:', cacheError);
      }
    }

    // 6. Return response
    return NextResponse.json({
      success: true,
      data: result,
      cached: false,
    });

  } catch (error: any) {
    console.error('[/api/simulate] Unhandled exception:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'Internal server error',
        },
      },
      { status: 500 }
    );
  }
}
