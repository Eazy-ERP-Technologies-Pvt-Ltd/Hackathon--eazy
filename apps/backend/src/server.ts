import http from 'http';
import { handleHealthCheck } from './routes/health';
import { proxyAIInference } from './routes/ai';
import { AIInferenceRequest } from '../../../packages/shared/contracts/ai';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // Healthcheck Route
  if (url.pathname === '/health' && req.method === 'GET') {
    const health = handleHealthCheck();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health));
    return;
  }

  // AI Inference Proxy Route
  if (url.pathname === '/api/ai/infer' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body) as AIInferenceRequest;
        const result = await proxyAIInference(payload);
        res.writeHead(result.success ? 200 : 502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: { code: 'INVALID_JSON', message: 'Failed to parse JSON body' },
          meta: { timestamp: new Date().toISOString(), requestId: `err_${Date.now()}` }
        }));
      }
    });
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${url.pathname} not found` },
    meta: { timestamp: new Date().toISOString(), requestId: `404_${Date.now()}` }
  }));
});

server.listen(PORT, () => {
  console.log(`[Backend Core] Server active at http://localhost:${PORT}`);
});
