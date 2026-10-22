import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GrowthEngineData, OpportunityLeakage, PrescriptiveDirective } from '../../../../packages/shared/contracts/growth-engine';
import { ApiResponse } from '../../../../packages/shared/contracts/api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/growth_engine_data.json');

function loadEngineData(): GrowthEngineData {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error('Engine dataset not found. Please run scripts/build_engine_data.py first.');
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as GrowthEngineData;
}

export function handleGetSummary(): ApiResponse {
  const data = loadEngineData();
  return {
    success: true,
    data: {
      metadata: data.metadata,
      kpis: data.kpis,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`,
    },
  };
}

export function handleGetLeakages(category?: string, severity?: string): ApiResponse<{ leakages: OpportunityLeakage[]; total: number }> {
  const data = loadEngineData();
  let items = data.leakages;

  if (category && category !== 'ALL') {
    items = items.filter(l => l.category === category);
  }
  if (severity && severity !== 'ALL') {
    items = items.filter(l => l.severity === severity);
  }

  return {
    success: true,
    data: {
      leakages: items,
      total: items.length,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`,
    },
  };
}

export function handleGetDirectives(): ApiResponse<PrescriptiveDirective[]> {
  const data = loadEngineData();
  return {
    success: true,
    data: data.directives,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`,
    },
  };
}

export function handleGetTerritories(): ApiResponse {
  const data = loadEngineData();
  return {
    success: true,
    data: data.territories,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`,
    },
  };
}

export function handleGetCategories(): ApiResponse {
  const data = loadEngineData();
  return {
    success: true,
    data: data.categories,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`,
    },
  };
}

export function handleGetSchemes(): ApiResponse {
  const data = loadEngineData();
  return {
    success: true,
    data: data.schemes,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`,
    },
  };
}

export function handleGetReps(): ApiResponse {
  const data = loadEngineData();
  return {
    success: true,
    data: data.reps,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}`,
    },
  };
}
