let Queue: any;
try {
  Queue = require('bullmq').Queue;
} catch { Queue = null; }

const redisAvailable = !!process.env.REDIS_HOST || false;

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379
};

// In-memory fallback queue when Redis is not available
const memoryQueue: Array<{ name: string; payload: any; opts: any }> = [];

export const taskQueue = (Queue && redisAvailable)
  ? new Queue('agent-tasks', { connection })
  : null;

export async function enqueueTask(name: string, payload: any, opts: any = {}) {
  if (taskQueue) {
    try {
      return await taskQueue.add(name, payload, opts);
    } catch (err) {
      console.error('enqueueTask failed', err);
      throw err;
    }
  } else {
    // fallback: process inline without Redis
    memoryQueue.push({ name, payload, opts });
    console.log(`[queue:memory] enqueued task "${name}" (Redis not available)`);
    return { id: `mem-${Date.now()}` };
  }
}

export default { taskQueue, enqueueTask };
