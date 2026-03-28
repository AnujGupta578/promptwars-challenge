import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveActionStream } from '@/lib/agents/orchestrator';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const requestSchema = z.object({
  text: z.string().optional(),
  mediaType: z.enum(['image', 'audio', 'none']).default('none'),
  mediaBase64: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = requestSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    const { text, mediaType, mediaBase64 } = parsedData.data;

    // 1. Get the stream from the Multi-Agent Orchestrator
    const resultStream = await resolveActionStream({ text, mediaType, mediaBase64 });

    // 2. Setup standard web stream response for Next.js
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullText = "";
        
        try {
          for await (const chunk of resultStream.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            controller.enqueue(encoder.encode(chunkText));
          }

          // 🏆 Project 100: Grounding & Persistence
          // Once the stream is complete, parse and store the final result
          const finalPlan = JSON.parse(fullText);
          await addDoc(collection(db, "bridge-logs"), {
            ...finalPlan,
            originalInput: text || '',
            mediaType,
            timestamp: serverTimestamp()
          });
        } catch (e) {
          console.error("Streaming/Logging error:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
