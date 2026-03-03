import { Job } from 'bullmq';

import { enqueueAnalysisJob } from '../queue';

import path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import { updateJob } from '../../models/job';
import { enqueueAnalysisJob } from '../queue';
import { fetchMetadata } from '../../services/ingestion';
import { transcribeWithWhisper } from '../../services/transcript';

export async function processIngestion(job: Job) {
  const { youtubeUrl, options, userId, jobId } = job.data as any;
  updateJob(jobId, { status: 'processing', progress: 5 });
  console.log('Ingestion job started', jobId, youtubeUrl);
  try {
    const metadata = await fetchMetadata(youtubeUrl);
    updateJob(jobId, { progress: 20 });
    // download video
    const videoId = metadata.title.replace(/\W+/g, '_') + '_' + Date.now();
    const tmpDir = path.join(__dirname, '../../../tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const dest = path.join(tmpDir, `${videoId}.mp4`);
    await new Promise<void>((resolve, reject) => {
      ytdl(youtubeUrl, { quality: 'highest' })
        .pipe(fs.createWriteStream(dest))
        .on('finish', () => resolve())
        .on('error', reject);
    });
    updateJob(jobId, { progress: 50 });
    let transcript = '';
    // for simplicity always use Whisper
    transcript = await transcribeWithWhisper(dest);
    updateJob(jobId, { progress: 70 });
    // enqueue analysis
    await enqueueAnalysisJob({ videoId, transcript, jobId });
    updateJob(jobId, { progress: 80 });
  } catch (err: any) {
    console.error(err);
    updateJob(jobId, { status: 'failed', error: err.message });
    throw err;
  }
}
