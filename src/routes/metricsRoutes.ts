import { Router } from 'express';
import client from 'prom-client';

const router = Router();

// Collect default system metrics
client.collectDefaultMetrics();

router.get('/metrics', async (_req, res) => {
  try {
    const metrics = await client.register.metrics();
    res.setHeader('Content-Type', client.register.contentType);
    res.send(metrics);
  } catch (err) {
    res.status(500).send('error collecting metrics');
  }
});

export default router;
