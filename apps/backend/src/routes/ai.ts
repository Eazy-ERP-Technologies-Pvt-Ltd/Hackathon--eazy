import { ApiResponse } from '../../../packages/shared/contracts/api';
import { AIInferenceRequest, AIInferenceResponse } from '../../../packages/shared/contracts/ai';

export async function proxyAIInference(
  request: AIInferenceRequest,
  aiServiceUrl = 'http://localhost:5000/infer'
): Promise<ApiResponse<AIInferenceResponse>> {
  try {
    const response = await fetch(aiServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Caller': 'backend-core',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`AI service responded with status ${response.status}`);
    }

    const data = (await response.json()) as AIInferenceResponse;

    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_ai_${Date.now()}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        code: 'AI_INFERENCE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown AI error',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_ai_err_${Date.now()}`,
      },
    };
  }
}
