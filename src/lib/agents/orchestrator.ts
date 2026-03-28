import { visionAgent } from './specialized/VisionAgent';
import { strategyAgentStream, ActionPlan } from './specialized/StrategyAgent';

export type { ActionPlan };
export type Modality = 'none' | 'image' | 'audio';

export interface ResolveInput {
  text?: string;
  mediaType: Modality;
  mediaBase64?: string;
}

/**
 * Orchestrator coordinates the Multi-Agent pipeline.
 * It now returns a stream for maximum efficiency.
 */
export async function resolveActionStream(input: ResolveInput) {
  let visionContext = '';

  // 1. Vision Agent (Serial phase - needs full image context)
  if (input.mediaType === 'image' && input.mediaBase64) {
    visionContext = await visionAgent(input.mediaBase64);
  }

  // 2. Strategy Agent (Streaming phase)
  return strategyAgentStream(input.text || 'No text input.', visionContext);
}

