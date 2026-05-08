import { NextRequest } from 'next/server';
import { findIntent } from '@/lib/chat-fallback';

// To enable real Claude AI streaming:
// 1. npm install @anthropic-ai/sdk
// 2. Add ANTHROPIC_API_KEY=sk-... to .env.local
// 3. Uncomment the Anthropic section below and remove the fallback-only block

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let messages: { role: string; content: string }[];
  try {
    ({ messages } = await req.json());
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('invalid');
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sanitized = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-10);

  const lastUser = sanitized.filter(m => m.role === 'user').at(-1);
  const intent = lastUser ? findIntent(lastUser.content) : {
    reply: "I'm here to help — what would you like to know about KITOGO?",
  };

  return new Response(intent.reply, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
