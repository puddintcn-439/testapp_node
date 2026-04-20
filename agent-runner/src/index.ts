import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { loadAgentManifests } from './manifestLoader';
import { agentHandlers } from './agents';
import { Coordinator } from './coordinator';
const app = express();

// capture raw body for webhook signature verification
const rawBodySaver = (req: any, res: any, buf: Buffer, encoding: string) => {
  if (buf && buf.length) req.rawBody = buf;
};
app.use(bodyParser.json({ verify: rawBodySaver }));

// warn on missing critical envs
if (!process.env.GITHUB_TOKEN) {
  console.warn('Warning: GITHUB_TOKEN not set — GitHub integration will be disabled (mock mode).');
}
if (!process.env.LLM_API_KEY) {
  console.warn('Warning: LLM_API_KEY not set — LLM calls will use mock responses.');
}

const manifests = loadAgentManifests();
console.log('Loaded agent manifests:', manifests.map((m: any) => m?.name));

app.get('/agents', (req, res) => res.json(manifests.map((m: any) => ({ name: m.name, description: m.description }))));

app.post('/webhook', async (req, res) => {
  const event = (req.headers['x-github-event'] as string) || (req.query.event as string) || 'unknown';
  const payload = req.body;
  // verify signature if secret configured
  const secret = process.env.WEBHOOK_SECRET;
  if (secret) {
    const sig256 = (req.headers['x-hub-signature-256'] || req.headers['x-hub-signature']) as string || '';
    const raw = (req as any).rawBody || Buffer.from(JSON.stringify(req.body || {}));
    let valid = false;
    if (sig256 && sig256.startsWith('sha256=')) {
      const hmac = crypto.createHmac('sha256', secret).update(raw).digest('hex');
      const expected = `sha256=${hmac}`;
      try {
        valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig256));
      } catch (e) {
        valid = expected === sig256;
      }
    } else if (sig256 && sig256.startsWith('sha1=')) {
      const hmac = crypto.createHmac('sha1', secret).update(raw).digest('hex');
      const expected = `sha1=${hmac}`;
      try {
        valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig256));
      } catch (e) {
        valid = expected === sig256;
      }
    }
    if (!valid) {
      console.warn('Invalid webhook signature');
      return res.status(401).json({ ok: false, error: 'invalid signature' });
    }
  }
  try {
    await Coordinator.handle({ event, payload, manifests, handlers: agentHandlers });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook handler error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Agent runner listening on http://localhost:${port}`);
});
