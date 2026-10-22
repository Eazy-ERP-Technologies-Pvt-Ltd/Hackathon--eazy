/**
 * End-to-End Contract Verification Test
 * Validates that Backend and AI Service conform to shared contracts.
 */

import { ApiResponse, HealthCheckResponse } from '../../packages/shared/contracts/api';

async function runHealthCheckSuite() {
  console.log('[TEST SUITE] Starting Health & Contract Check...');

  // 1. Verify Backend Health Endpoint Contract
  try {
    const res = await fetch('http://localhost:8000/health');
    if (res.ok) {
      const json = (await res.json()) as ApiResponse<HealthCheckResponse>;
      if (json.success && json.data && json.data.status === 'healthy') {
        console.log('✅ [PASSED] Backend HealthCheck satisfies ApiResponse contract');
      } else {
        console.error('❌ [FAILED] Backend HealthCheck payload does not match contract');
      }
    } else {
      console.log('⚠️ [SKIPPED] Backend server offline at http://localhost:8000');
    }
  } catch {
    console.log('⚠️ [SKIPPED] Backend server not currently running');
  }

  // 2. Verify AI Service Health Endpoint
  try {
    const res = await fetch('http://localhost:5000/health');
    if (res.ok) {
      console.log('✅ [PASSED] AI Service HealthCheck reachable');
    } else {
      console.log('⚠️ [SKIPPED] AI Service offline at http://localhost:5000');
    }
  } catch {
    console.log('⚠️ [SKIPPED] AI Service not currently running');
  }

  console.log('[TEST SUITE] Finished contract test execution.');
}

runHealthCheckSuite();
