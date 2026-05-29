import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Calls API] Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const phoneFilter = searchParams.get('phone');

    let query = supabase
      .from('calls')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Optional phone number filter
    if (phoneFilter) {
      query = query.or(`phone_from.ilike.%${phoneFilter}%,phone_to.ilike.%${phoneFilter}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[Calls API] Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      calls: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Calls API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
