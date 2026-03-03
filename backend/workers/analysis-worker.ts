import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { processAnalysis } from '../src/jobs/processors/analysisProcessor';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

new Worker('analysis', async job => {
  await processAnalysis(job);
}, { connection });
