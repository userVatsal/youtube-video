import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { processRender } from '../src/jobs/processors/renderProcessor';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

const worker = new Worker('render', async job => {
  await processRender(job);
}, { connection });

worker.on('completed', job => {
  console.log(`Render job ${job.id} completed`);
});
worker.on('failed', (job, err) => {
  console.error(`Render job ${job?.id} failed:`, err);
});
