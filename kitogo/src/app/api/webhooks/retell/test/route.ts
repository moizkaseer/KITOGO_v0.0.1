import { NextResponse } from 'next/server';

// Test endpoint to simulate Retell webhooks
export async function POST(req: Request) {
  try {
    const testEvent = {
      event: 'call_ended',
      call_id: `test_${Date.now()}`,
      from_number: '+1234567890',
      to_number: '+0987654321',
      duration_ms: 45000,
      transcript: 'Test call transcript for demo purposes.',
      timestamp: new Date().toISOString(),
    };

    // Forward to actual webhook
    const response = await fetch(
      `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/webhooks/retell`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testEvent),
      }
    );

    const result = await response.json();
    return NextResponse.json({
      success: response.ok,
      testEvent,
      result,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
