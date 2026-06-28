import { NextResponse } from 'next/server';
import { supabase, type ScenarioRow } from '@/lib/supabase';

// ─── Response Types ───────────────────────────────────────────────────────────

interface ApiSuccess<T> {
  success: true;
  data: T;
  error: null;
}

interface ApiError {
  success: false;
  data: null;
  error: { code: string; message: string };
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse<ApiResponse<ScenarioRow[]>>> {
  // Guard: env vars not configured yet
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-project-url-here' ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your-anon-key-here'
  ) {
    console.warn('[/api/scenarios] Supabase env vars not configured — returning 503.');
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'SUPABASE_NOT_CONFIGURED',
          message:
            'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and ' +
            'NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.',
        },
      } satisfies ApiError,
      { status: 503 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('isActive', true)
      .order('createdAt', { ascending: true });

    if (error) {
      console.error('[/api/scenarios] Supabase query error:', error.message);
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { code: 'SUPABASE_ERROR', message: error.message },
        } satisfies ApiError,
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: data as ScenarioRow[], error: null } satisfies ApiSuccess<ScenarioRow[]>,
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    console.error('[/api/scenarios] Unhandled error:', message);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { code: 'INTERNAL_ERROR', message },
      } satisfies ApiError,
      { status: 500 }
    );
  }
}
