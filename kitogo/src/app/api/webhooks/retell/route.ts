import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import {
  type RetellEvent,
  buildCallData,
  normalizeEvent,
  nonNullPatch,
} from '@/lib/retell';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase credentials not configured');
  return createClient(url, key);
}
type SB = ReturnType<typeof getSupabase>;

async function saveEventLog(supabase: SB, event: RetellEvent) {
  try {
    await supabase.from('call_events').insert({
      retell_call_id: event.call_id,
      event_type: event.event,
      payload: event,
    });
  } catch (error) {
    console.error('[Retell Webhook] Failed to log event:', error);
    // Don't block main flow on logging failure
  }
}

async function upsertCall(supabase: SB, event: RetellEvent) {
  const callData = buildCallData(event);

  // Only write columns that are non-null so a later call_ended (no analysis)
  // doesn't wipe a summary saved by an earlier call_analyzed, and vice-versa.
  const { data: existing } = await supabase
    .from('calls')
    .select('id')
    .eq('retell_call_id', event.call_id)
    .maybeSingle();

  if (existing) {
    const patch = nonNullPatch(callData);
    const { error } = await supabase.from('calls').update(patch).eq('retell_call_id', event.call_id);
    if (error) throw error;
    console.log('[Retell Webhook] ✓ Call updated:', event.call_id, { hasSummary: !!callData.summary });
  } else {
    const { error } = await supabase.from('calls').insert(callData);
    if (error) throw error;
    console.log('[Retell Webhook] ✓ Call inserted:', event.call_id, { hasSummary: !!callData.summary });
  }
}

export async function POST(req: Request) {
  let event: RetellEvent;

  try {
    event = await req.json();
  } catch (error) {
    console.error('[Retell Webhook] Invalid JSON:', error);
    return NextResponse.json({ ok: false, error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Normalize: Retell nests call fields inside a `call` object
  event = normalizeEvent(event);

  if (!event.call_id || !event.event) {
    console.error('[Retell Webhook] Missing required fields:', { call_id: event.call_id, event: event.event });
    return NextResponse.json({ ok: false, error: 'Missing call_id or event type' }, { status: 400 });
  }

  console.log(`[Retell Webhook] Received: ${event.event} (${event.call_id})`);

  let supabase: SB;
  try {
    supabase = getSupabase();
  } catch (error) {
    console.error('[Retell Webhook] Supabase init failed:', error);
    return NextResponse.json({ ok: false, error: 'Server not configured' }, { status: 500 });
  }

  await saveEventLog(supabase, event);

  try {
    switch (event.event) {
      case 'call_started':
        console.log('[Retell Webhook] Call started:', event.call_id);
        break;

      case 'call_ended':
      case 'call_analyzed':
        // call_ended gives us the transcript; call_analyzed adds the summary + sentiment.
        // upsertCall merges both so whichever arrives second fills in the gaps.
        await upsertCall(supabase, event);
        break;

      default:
        console.log('[Retell Webhook] Unknown event type:', event.event);
    }

    return NextResponse.json({ ok: true, call_id: event.call_id });
  } catch (error) {
    console.error('[Retell Webhook] Processing error:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const healthy = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  return NextResponse.json({
    status: healthy ? 'healthy' : 'missing-credentials',
    supabaseConfigured: healthy,
  });
}
