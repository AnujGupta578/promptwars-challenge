import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveAction } from '@/lib/agents/orchestrator';

// Define the input schema
const requestSchema = z.object({
  text: z.string().optional(),
  mediaType: z.enum(['image', 'audio', 'none']).default('none'),
  mediaBase64: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate the input using Zod
    const parsedData = requestSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedData.error.format() },
        { status: 400 }
      );
    }
    
    const { text, mediaType, mediaBase64 } = parsedData.data;

    // Call the orchestrator
    const result = await resolveAction({
      text,
      mediaType,
      mediaBase64,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('An unknown error occurred');
    console.error('Error resolving action:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err.message },
      { status: 500 }
    );
  }
}
