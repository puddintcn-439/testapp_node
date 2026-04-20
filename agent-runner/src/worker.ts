import { Worker } from 'bullmq';
import { agentHandlers } from './agents';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379
};

const worker = new Worker('agent-tasks', async job => {
  const { handler, event, payload } = job.data as any;
  console.log('[worker] processing', handler, event);
  const h = agentHandlers[handler];
  if (!h || !h.handle) throw new Error('handler not found: ' + String(handler));
  return await h.handle({ event, payload }, {});
}, { connection });

worker.on('completed', job => console.log('[worker] job completed', job.id));
worker.on('failed', (job, err) => console.error('[worker] job failed', job?.id, err));

export default worker;
