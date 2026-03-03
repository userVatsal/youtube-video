import { Job } from 'bullmq';
import { updateJob, getJob } from '../../models/job';

export async function processAiTeam(job: Job) {
  const { videoId, script, jobId } = job.data as any;
  console.log('AI team job started', jobId);
  // dummy outputs
  const titles = ['Amazing Video', 'You Won\'t Believe This', 'Top 10 Things'];
  const description = 'Generated description based on script...';
  const tags = ['ai', 'video', 'youtube'];
  const thumbnailPrompt = 'close-up face, bright colors, text overlay';
  // update job result with additional metadata
  const existing = getJob(jobId)?.result || {};
  updateJob(jobId, { result: { ...existing, titles, description, tags, thumbnailPrompt } });
}
