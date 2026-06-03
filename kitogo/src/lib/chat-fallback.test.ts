import { describe, it, expect } from 'vitest';
import { findIntent } from './chat-fallback';

describe('findIntent', () => {
  it('matches pricing questions', () => {
    const intent = findIntent('How much does it cost?');
    expect(intent.reply).toContain('$1,500/mo');
    expect(intent.followUps).toContain('Tell me about Growth');
  });

  it('matches demo / scheduling questions', () => {
    expect(findIntent('Can I book a demo?').reply).toContain('demos take 25 minutes');
    expect(findIntent('I want to try it').reply).toContain('demos take 25 minutes');
  });

  it('matches security / compliance questions across keywords', () => {
    for (const q of ['Are you HIPAA compliant?', 'Tell me about SOC 2', 'Do you sign a BAA?', 'How is data encrypted?']) {
      expect(findIntent(q).reply).toContain('HIPAA-compliant');
    }
  });

  it('matches EHR / integration questions', () => {
    expect(findIntent('Do you integrate with Epic?').reply).toContain('Epic');
    expect(findIntent('What about FHIR support?').reply).toContain('FHIR R4');
  });

  it('matches triage questions', () => {
    expect(findIntent('How does symptom triage work?').reply).toContain('ESI 5-level');
  });

  it('matches implementation timeline questions', () => {
    expect(findIntent('How long does onboarding take?').reply).toContain('go live in 2 weeks');
  });

  it('is case-insensitive', () => {
    expect(findIntent('PRICING please').reply).toBe(findIntent('pricing please').reply);
  });

  it('returns the default intent when nothing matches', () => {
    const intent = findIntent('What is the weather today?');
    expect(intent.reply).toContain('get a real human on this');
    expect(intent.match).toBeUndefined();
  });

  it('returns the first matching intent when multiple could apply', () => {
    // "pricing" is defined before "demo"; a query hitting both resolves to pricing.
    const intent = findIntent('what is the pricing for a demo?');
    expect(intent.reply).toContain('$1,500/mo');
  });

  it('always returns an object with a reply string', () => {
    for (const q of ['', '   ', '12345', 'random gibberish xyz']) {
      const intent = findIntent(q);
      expect(typeof intent.reply).toBe('string');
      expect(intent.reply.length).toBeGreaterThan(0);
    }
  });
});
