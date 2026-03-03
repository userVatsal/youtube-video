import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

export const ingestionQueue = new Queue('ingestion', { connection });
export const analysisQueue = new Queue('analysis', { connection });
export const renderQueue = new Queue('render', { connection });
export const aiTeamQueue = new Queue('aiTeam', { connection });

interface IngestionPayload {
  youtubeUrl: string;
  options: any;
  userId?: string;
  jobId: string;
}

export function enqueueIngestionJob(payload: IngestionPayload) {
  return ingestionQueue.add('ingest', payload, { attempts: 5, backoff: { type: 'exponential', delay: 5000 } });
}

interface AnalysisPayload {
  videoId: string;
  transcript: string;
  jobId: string;
}

export function enqueueAnalysisJob(payload: AnalysisPayload) {
  return analysisQueue.add('analyze', payload, { attempts: 5, backoff: { type: 'exponential', delay: 5000 } });
}

interface RenderPayload {
  videoId: string;
  clips: Array<{start: string; end: string}>;
  style: any;
  jobId: string;
  transcript?: string;
}

export function enqueueRenderJob(payload: RenderPayload) {
  return renderQueue.add('render', payload, { attempts: 3 });
}

interface AiTeamPayload {
  videoId: string;
  script: string;
  jobId: string;
}

export function enqueueAiTeamJob(payload: AiTeamPayload) {
  return aiTeamQueue.add('aiTeam', payload, { attempts: 3 });
}
