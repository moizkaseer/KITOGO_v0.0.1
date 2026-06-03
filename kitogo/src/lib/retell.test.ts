import { describe, it, expect } from 'vitest';
import {
  type RetellEvent,
  normalizeEvent,
  buildCallData,
  nonNullPatch,
} from './retell';

describe('normalizeEvent', () => {
  it('returns the event unchanged when there is no nested call object', () => {
    const event: RetellEvent = { event: 'call_ended', call_id: 'abc', from_number: '+1555' };
    expect(normalizeEvent(event)).toEqual(event);
  });

  it('hoists nested call fields to the top level', () => {
    const event: RetellEvent = {
      event: 'call_analyzed',
      call: {
        call_id: 'call_123',
        from_number: '+15551234567',
        to_number: '+15559876543',
        duration_ms: 42000,
        transcript: 'User: hello',
        call_analysis: { call_summary: 'A short call' },
      },
    };
    const normalized = normalizeEvent(event);
    expect(normalized.call_id).toBe('call_123');
    expect(normalized.from_number).toBe('+15551234567');
    expect(normalized.to_number).toBe('+15559876543');
    expect(normalized.duration_ms).toBe(42000);
    expect(normalized.transcript).toBe('User: hello');
    expect(normalized.call_analysis?.call_summary).toBe('A short call');
  });

  it('prefers top-level fields over nested ones', () => {
    const event: RetellEvent = {
      event: 'call_ended',
      call_id: 'top_level_id',
      call: { call_id: 'nested_id', from_number: '+1999' },
    };
    const normalized = normalizeEvent(event);
    expect(normalized.call_id).toBe('top_level_id');
    // from_number only exists nested, so it is still hoisted
    expect(normalized.from_number).toBe('+1999');
  });

  it('does not mutate the original event', () => {
    const event: RetellEvent = { event: 'call_ended', call: { call_id: 'x' } };
    const before = JSON.stringify(event);
    normalizeEvent(event);
    expect(JSON.stringify(event)).toBe(before);
  });
});

describe('buildCallData', () => {
  it('maps a fully-populated event to a call row', () => {
    const event: RetellEvent = {
      event: 'call_analyzed',
      call_id: 'call_1',
      from_number: '+1555',
      to_number: '+1666',
      transcript: 'User: I need help',
      duration_ms: 65500,
      call_analysis: {
        call_summary: 'Caller asked for help',
        user_sentiment: 'Positive',
        custom_analysis_data: { feeling_status: 'anxious' },
      },
    };
    expect(buildCallData(event)).toEqual({
      retell_call_id: 'call_1',
      phone_from: '+1555',
      phone_to: '+1666',
      transcript: 'User: I need help',
      duration_seconds: 66, // 65500ms rounds to 66s
      status: 'completed',
      summary: 'Caller asked for help',
      sentiment: 'Positive · anxious',
    });
  });

  it('folds feeling_status into sentiment only when present', () => {
    const base: RetellEvent = {
      event: 'call_analyzed',
      call_id: 'c',
      call_analysis: { user_sentiment: 'Neutral' },
    };
    expect(buildCallData(base).sentiment).toBe('Neutral');
  });

  it('nulls out missing optional fields rather than emitting undefined', () => {
    const event: RetellEvent = { event: 'call_ended', call_id: 'c2' };
    const data = buildCallData(event);
    expect(data.phone_from).toBeNull();
    expect(data.phone_to).toBeNull();
    expect(data.transcript).toBeNull();
    expect(data.duration_seconds).toBeNull();
    expect(data.summary).toBeNull();
    expect(data.sentiment).toBeNull();
  });

  it('rounds duration to the nearest second', () => {
    expect(buildCallData({ event: 'x', call_id: 'c', duration_ms: 1499 }).duration_seconds).toBe(1);
    expect(buildCallData({ event: 'x', call_id: 'c', duration_ms: 1500 }).duration_seconds).toBe(2);
    expect(buildCallData({ event: 'x', call_id: 'c', duration_ms: 0 }).duration_seconds).toBeNull();
  });

  it('treats empty strings as null', () => {
    const data = buildCallData({ event: 'x', call_id: 'c', from_number: '', transcript: '' });
    expect(data.phone_from).toBeNull();
    expect(data.transcript).toBeNull();
  });
});

describe('nonNullPatch', () => {
  it('drops null and undefined fields so partial events do not wipe data', () => {
    const data = buildCallData({ event: 'call_ended', call_id: 'c3', transcript: 'User: hi' });
    const patch = nonNullPatch(data);
    expect(patch).toHaveProperty('transcript', 'User: hi');
    expect(patch).toHaveProperty('retell_call_id', 'c3');
    expect(patch).toHaveProperty('status', 'completed');
    // a call_ended with no analysis must NOT include a summary key
    expect(patch).not.toHaveProperty('summary');
    expect(patch).not.toHaveProperty('sentiment');
    expect(patch).not.toHaveProperty('duration_seconds');
  });
});
