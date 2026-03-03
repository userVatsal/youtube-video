import { Request, Response } from 'express';
import { enqueueIngestionJob } from '../jobs/queue';
import { createJob, getJob } from '../models/job';

import { validateYouTubeUrl } from '../services/ingestion';

export async function submitVideo(req: Request, res: Response) {
  try {
    const { youtubeUrl, options, userId } = req.body;
    if (!youtubeUrl || !validateYouTubeUrl(youtubeUrl)) {
      return res.status(400).json({ error: 'invalid youtube url' });
    }
    const jobRecord = createJob('job-' + Date.now());
    const job = await enqueueIngestionJob({ youtubeUrl, options, userId, jobId: jobRecord.id });
    res.status(202).json({ jobId: jobRecord.id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to enqueue video' });
  }
}

export async function getJobStatus(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const job = getJob(id);
    if (!job) return res.status(404).json({ error: 'job not found' });
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: 'Unable to fetch status' });
  }
}

export async function getVideo(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const job = getJob(id);
    if (!job) return res.status(404).json({ error: 'job not found' });
    res.json(job.result || {});
  } catch (err: any) {
    res.status(500).json({ error: 'Unable to fetch video' });
  }
}
