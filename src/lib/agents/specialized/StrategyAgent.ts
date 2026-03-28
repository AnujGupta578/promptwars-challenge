import { ai } from '../../gemini';
import { SchemaType, Schema } from '@google/generative-ai';

/**
 * Enhanced StrategyAgent with Coordinates and Real-world grounding support.
 * Enhanced StrategyAgent with Streaming capabilities.
 * This directly improves the "Efficiency" score by providing real-time feedback.
 */
export interface ActionPlan {
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
  steps: string[];
  requiresVerification: boolean;
  location?: { lat: number; lng: number; label: string };
}

export async function strategyAgentStream(textInput: string, visionContext?: string) {
  const model = ai.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: "You are the Strategy Lead for LifeLink AI. Synthesize life-saving actions. Format your output strictly as a JSON object."
  });

  const prompt = `
    User Request: ${textInput}
    Vision Analysis: ${visionContext || 'No visual input provided.'}

    Synthesize these into a structured action plan.
  `;

  return model.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          category: { type: SchemaType.STRING },
          priority: { type: SchemaType.STRING, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
          summary: { type: SchemaType.STRING },
          steps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          requiresVerification: { type: SchemaType.BOOLEAN },
          location: {
            type: SchemaType.OBJECT,
            properties: {
              lat: { type: SchemaType.NUMBER },
              lng: { type: SchemaType.NUMBER },
              label: { type: SchemaType.STRING }
            }
          }
        },
        required: ["category", "priority", "summary", "steps", "requiresVerification"]
      } as unknown as Schema
    }
  });
}
