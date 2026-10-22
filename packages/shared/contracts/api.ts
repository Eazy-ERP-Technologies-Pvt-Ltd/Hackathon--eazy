/**
 * Standard API Response and Error Contract
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error?: ApiError;
  meta: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  timestamp: string;
  requestId: string;
  version?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  service: string;
  version: string;
}
