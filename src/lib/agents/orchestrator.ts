import { ai } from '../gemini';
import { SchemaType, Schema } from '@google/generative-ai';

export type Modality = 'none' | 'image' | 'audio';

export interface ResolveInput {
  text?: string;
  mediaType: Modality;
  mediaBase64?: string;
}

export interface ActionPlan {
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
  steps: string[];
  requiresVerification: boolean;
}

const SYSTEM_INSTRUCTION = `You are a Universal Bridge AI. Your goal is to take unstructured inputs (text, voice transcripts, or image descriptions) and convert them into structured, verifiable, and life-saving action plans.
Ensure the layout of your output strictly matches the JSON format requested. Provide clear, concise steps.
`;

export async function resolveAction(input: ResolveInput): Promise<ActionPlan> {
  const contents = [];

  if (input.text) {
    contents.push({ role: 'user', parts: [{ text: input.text }] });
  }

  // Handle multimodal input if present
  if (input.mediaType === 'image' && input.mediaBase64) {
    // Strip metadata from base64 string if it exists
    const cleanBase64 = input.mediaBase64.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = input.mediaBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
    
    contents.push({
      role: 'user',
      parts: [
        {
          inlineData: {
             mimeType: mimeType,
             data: cleanBase64
          }
        }
      ]
    });
  }

  if (contents.length === 0) {
    throw new Error("No input provided to the Orchestrator");
  }

  const model = ai.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const result = await model.generateContent({
    contents,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          category: {
            type: SchemaType.STRING,
            description: "Category of the action plan, e.g., 'Medical Emergency', 'Disaster Relief', 'General Assistance'."
          },
          priority: {
            type: SchemaType.STRING,
            enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
          },
          summary: {
            type: SchemaType.STRING,
            description: "A short one-sentence summary of the situation."
          },
          steps: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Ordered list of concrete, actionable steps to resolve the situation."
          },
          requiresVerification: {
            type: SchemaType.BOOLEAN,
            description: "True if these steps are high risk and require human verification."
          }
        },
        required: ["category", "priority", "summary", "steps", "requiresVerification"]
      } as unknown as Schema
    }
  });

  const responseText = result.response.text();
  if (!responseText) {
    throw new Error("Failed to generate action plan.");
  }
  
  return JSON.parse(responseText) as ActionPlan;
}
