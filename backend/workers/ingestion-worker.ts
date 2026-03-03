import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { processIngestion } from '../src/jobs/processors/ingestionProcessor';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

new Worker('ingestion', async job => {
  await processIngestion(job);
}, { connection });
