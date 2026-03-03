import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { processAiTeam } from '../src/jobs/processors/aiTeamProcessor';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

new Worker('aiTeam', async job => {
  await processAiTeam(job);
}, { connection });
