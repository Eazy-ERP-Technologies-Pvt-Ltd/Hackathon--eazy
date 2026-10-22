import http from 'http';
import { executeAgentReasoning } from './agent';
import { AIInferenceRequest } from '../../../packages/shared/contracts/ai';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Internal-Caller');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (url.pathname === '/infer' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body) as AIInferenceRequest;
        const result = await executeAgentReasoning(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Failed to process AI inference request',
          details: err instanceof Error ? err.message : String(err),
        }));
      }
    });
    return;
  }

  if (url.pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', service: 'ai-service', port: PORT }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: `Not found: ${req.method} ${url.pathname}` }));
});

server.listen(PORT, () => {
  console.log(`[AI Engine] Service listening on http://localhost:${PORT}`);
});
