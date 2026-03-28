import { ai } from '../../gemini';

/**
 * VisionAgent is a specialized agent responsible for interpreting multimodal
 * input (images) to identify hazards, symptoms, or environmental context.
 */
export async function visionAgent(mediaBase64: string): Promise<string> {
  const cleanBase64 = mediaBase64.replace(/^data:image\/\w+;base64,/, '');
  const mimeType = mediaBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

  const model = ai.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: `You are a Technical Vision Analyst for the LifeLink AI Universal Bridge. Your mission is to identify hazards, injuries, and environmental context from visual inputs.
    Operational Protocol: Standardized Universal Bridge Protocol 1.1 -- Vision.
    Priority: Actionable life-saving intel.`
  });

  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [
        {
          inlineData: {
             mimeType: mimeType,
             data: cleanBase64
          }
        },
        { text: "Describe the situation in this image for emergency triage. Be precise and focus on actionable details." }
      ]
    }]
  });

  return result.response.text();
}
