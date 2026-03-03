export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface JobRecord {
  id: string;
  status: JobStatus;
  progress: number;
  result?: any;
  error?: string;
}

// simple in-memory store
const jobs: Record<string, JobRecord> = {};

export function createJob(id: string): JobRecord {
  const job: JobRecord = { id, status: 'queued', progress: 0 };
  jobs[id] = job;
  return job;
}

export function updateJob(id: string, data: Partial<JobRecord>) {
  if (!jobs[id]) return;
  jobs[id] = { ...jobs[id], ...data };
}

export function getJob(id: string): JobRecord | undefined {
  return jobs[id];
}
