/**
 * AI Service & LLM Inference Contracts
 */

export interface AIInferenceRequest {
  sessionId: string;
  userId: string;
  prompt: string;
  systemContext?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: AIToolDefinition[];
}

export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface AIInferenceResponse {
  sessionId: string;
  output: string;
  toolCalls?: AIToolCall[];
  finishReason: 'stop' | 'length' | 'tool_calls' | 'error';
  usage: AIUsageMetrics;
}

export interface AIUsageMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs?: number;
}
