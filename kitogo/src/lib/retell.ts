// Pure, side-effect-free helpers for the Retell webhook pipeline.
// Kept separate from the route handler so they can be unit-tested without
// pulling in next/server or the Supabase client.

export interface RetellCallObject {
  call_id: string;
  from_number?: string;
  to_number?: string;
  duration_ms?: number;
  transcript?: string;
  call_analysis?: {
    call_summary?: string;
    user_sentiment?: string;
    custom_analysis_data?: {
      feeling_status?: string;
      urgent_need?: boolean;
      concern_summary?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export interface RetellEvent {
  event: string;
  call_id?: string;
  call?: RetellCallObject;
  from_number?: string;
  to_number?: string;
  duration_ms?: number;
  transcript?: string;
  call_analysis?: RetellCallObject['call_analysis'];
  [key: string]: any;
}

export interface CallData {
  retell_call_id: string | undefined;
  phone_from: string | null;
  phone_to: string | null;
  transcript: string | null;
  duration_seconds: number | null;
  status: 'completed';
  summary: string | null;
  sentiment: string | null;
}

// Retell nests the call fields inside a `call` object on some events.
// Hoist them to the top level so downstream code has one shape to read.
// Top-level values win when both are present (?? keeps existing values).
export function normalizeEvent(event: RetellEvent): RetellEvent {
  if (!event.call) return event;
  return {
    ...event,
    call_id: event.call_id ?? event.call.call_id,
    from_number: event.from_number ?? event.call.from_number,
    to_number: event.to_number ?? event.call.to_number,
    duration_ms: event.duration_ms ?? event.call.duration_ms,
    transcript: event.transcript ?? event.call.transcript,
    call_analysis: event.call_analysis ?? event.call.call_analysis,
  };
}

// Build the row we persist to the `calls` table from a (normalized) event.
export function buildCallData(event: RetellEvent): CallData {
  const analysis = event.call_analysis;
  return {
    retell_call_id: event.call_id,
    phone_from: event.from_number || null,
    phone_to: event.to_number || null,
    transcript: event.transcript || null,
    duration_seconds: event.duration_ms ? Math.round(event.duration_ms / 1000) : null,
    status: 'completed',
    // Retell ships a ready-made summary + sentiment in call_analysis — no LLM call needed.
    // We fold feeling_status into sentiment so the dashboard can rate wellbeing without
    // requiring extra columns in the `calls` table.
    summary: analysis?.call_summary || null,
    sentiment:
      analysis?.user_sentiment
        ? analysis.custom_analysis_data?.feeling_status
          ? `${analysis.user_sentiment} · ${analysis.custom_analysis_data.feeling_status}`
          : analysis.user_sentiment
        : null,
  };
}

// Strip null/undefined so a later partial event (e.g. call_ended with no
// analysis) doesn't overwrite fields an earlier call_analyzed already filled.
export function nonNullPatch(callData: CallData): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(callData)) {
    if (v !== null && v !== undefined) patch[k] = v;
  }
  return patch;
}
