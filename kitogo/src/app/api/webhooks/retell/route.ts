import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase credentials not configured');
  return createClient(url, key);
}
type SB = ReturnType<typeof getSupabase>;

function getAnthropic(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  return key ? new Anthropic({ apiKey: key }) : null;
}

interface RetellCallObject {
  call_id: string;
  from_number?: string;
  to_number?: string;
  duration_ms?: number;
  transcript?: string;
  [key: string]: any;
}

interface RetellEvent {
  event: string;
  call_id?: string;
  call?: RetellCallObject;
  from_number?: string;
  to_number?: string;
  duration_ms?: number;
  transcript?: string;
  [key: string]: any;
}

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

async function generateSummary(transcript: string | null | undefined, callId: string): Promise<string | null> {
  if (!transcript || transcript.trim().length === 0) {
    return null;
  }

  const anthropic = getAnthropic();
  if (!anthropic) {
    console.warn('[Retell Webhook] Anthropic not configured, skipping summary');
    return null;
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Summarize this call transcript in 1-2 sentences:\n\n${transcript}`,
        },
      ],
    });

    const summary = message.content[0].type === 'text' ? message.content[0].text : null;
    console.log('[Retell Webhook] ✓ Summary generated:', callId);
    return summary;
  } catch (error) {
    console.error('[Retell Webhook] Failed to generate summary:', error);
    // Don't block call save on summary failure
    return null;
  }
}

async function saveCompletedCall(supabase: SB, event: RetellEvent) {
  const callData: Record<string, unknown> = {
    retell_call_id: event.call_id,
    phone_from: event.from_number || null,
    phone_to: event.to_number || null,
    transcript: event.transcript || null,
    duration_seconds: event.duration_ms ? Math.round(event.duration_ms / 1000) : null,
    status: 'completed',
  };

  // Generate summary if we have a transcript
  if (callData.transcript) {
    callData.summary = await generateSummary(callData.transcript as string, event.call_id!);
  }

  const { error: insertError } = await supabase
    .from('calls')
    .insert(callData);

  if (insertError) {
    console.error('[Retell Webhook] Failed to save call:', insertError);
    throw insertError;
  }

  console.log('[Retell Webhook] ✓ Call saved:', event.call_id, {
    duration: callData.duration_seconds,
    from: callData.phone_from,
    to: callData.phone_to,
    hasSummary: !!callData.summary,
  });
}

export async function POST(req: Request) {
  let event: RetellEvent;

  try {
    event = await req.json();
  } catch (error) {
    console.error('[Retell Webhook] Invalid JSON:', error);
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  // Normalize: Retell may nest call fields inside a `call` object
  if (event.call && !event.call_id) {
    event.call_id = event.call.call_id;
    event.from_number = event.from_number ?? event.call.from_number;
    event.to_number = event.to_number ?? event.call.to_number;
    event.duration_ms = event.duration_ms ?? event.call.duration_ms;
    event.transcript = event.transcript ?? event.call.transcript;
  }

  // Validate required fields
  if (!event.call_id || !event.event) {
    console.error('[Retell Webhook] Missing required fields:', { call_id: event.call_id, event: event.event });
    return NextResponse.json(
      { ok: false, error: 'Missing call_id or event type' },
      { status: 400 }
    );
  }

  console.log(`[Retell Webhook] Received: ${event.event} (${event.call_id})`);

  let supabase: SB;
  try {
    supabase = getSupabase();
  } catch (error) {
    console.error('[Retell Webhook] Supabase init failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Server not configured' },
      { status: 500 }
    );
  }

  // Always log the event
  await saveEventLog(supabase, event);

  // Handle different event types
  try {
    switch (event.event) {
      case 'call_started':
        console.log('[Retell Webhook] Call started:', event.call_id);
        break;

      case 'call_ended':
        await saveCompletedCall(supabase, event);
        break;

      case 'call_analyzed':
        console.log('[Retell Webhook] Call analyzed:', event.call_id);
        // Could store analysis results here
        break;

      default:
        console.log('[Retell Webhook] Unknown event type:', event.event);
    }

    // Return 200 OK immediately
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
