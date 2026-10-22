import { ApiResponse, HealthCheckResponse } from '../../../packages/shared/contracts/api';

export function handleHealthCheck(): ApiResponse<HealthCheckResponse> {
  return {
    success: true,
    data: {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'backend-core',
      version: '1.0.0',
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`,
      version: 'v1',
    },
  };
}
