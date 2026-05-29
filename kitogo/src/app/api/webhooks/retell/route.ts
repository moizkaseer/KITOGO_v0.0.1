import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[Retell Webhook] Missing Supabase credentials');
}

if (!anthropicApiKey) {
  console.warn('[Retell Webhook] Missing Anthropic API key - summaries will be skipped');
}

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

interface RetellEvent {
  event: string;
  call_id: string;
  from_number?: string;
  to_number?: string;
  duration_ms?: number;
  transcript?: string;
  [key: string]: any;
}

async function saveEventLog(event: RetellEvent) {
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

async function saveCompletedCall(event: RetellEvent) {
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
    callData.summary = await generateSummary(callData.transcript as string, event.call_id);
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

  // Validate required fields
  if (!event.call_id || !event.event) {
    console.error('[Retell Webhook] Missing required fields:', { call_id: event.call_id, event: event.event });
    return NextResponse.json(
      { ok: false, error: 'Missing call_id or event type' },
      { status: 400 }
    );
  }

  console.log(`[Retell Webhook] Received: ${event.event} (${event.call_id})`);

  // Always log the event
  await saveEventLog(event);

  // Handle different event types
  try {
    switch (event.event) {
      case 'call_started':
        console.log('[Retell Webhook] Call started:', event.call_id);
        break;

      case 'call_ended':
        await saveCompletedCall(event);
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
  const healthy = !!supabaseUrl && !!supabaseServiceKey;
  return NextResponse.json({
    status: healthy ? 'healthy' : 'missing-credentials',
    supabaseConfigured: healthy,
  });
}
