import { Queue } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379
};

export const taskQueue = new Queue('agent-tasks', { connection });

export async function enqueueTask(name: string, payload: any, opts: any = {}) {
  try {
    return await taskQueue.add(name, payload, opts);
  } catch (err) {
    console.error('enqueueTask failed', err);
    throw err;
  }
}

export default { taskQueue, enqueueTask };
