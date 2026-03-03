import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { validateYouTubeUrl, fetchMetadata, downloadVideo } from '../src/services/ingestion';
import { transcribeWithWhisper } from '../src/services/transcript';
import { detectViralClips } from '../src/services/viral';
import { rewriteScript } from '../src/services/style';
import { generateTitles, generateTags } from '../src/services/ai-team';
import { uploadFile, getPublicUrl } from '../src/services/storage';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Helper to run FFmpeg
function runFfmpeg(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error('ffmpeg error', stderr);
        return reject(err);
      }
      resolve();
    });
  });
}

// Helper to update job in DB
async function updateJob(jobId: string, data: any) {
  await supabase
    .from('jobs')
    .update({ ...data, updated_at: new Date() })
    .eq('id', jobId);
}

// Helper to get job
async function getJobStatus(jobId: string) {
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();
  return data;
}

// POST /api/videos - submit job
app.post('/api/videos', async (req: Request, res: Response) => {
  try {
    const { youtubeUrl, options } = req.body;
    
    if (!youtubeUrl || !validateYouTubeUrl(youtubeUrl)) {
      return res.status(400).json({ error: 'invalid youtube url' });
    }

    const jobId = 'job-' + Date.now();
    
    // Create job record
    await supabase.from('jobs').insert({
      id: jobId,
      status: 'queued',
      progress: 0
    });

    res.status(202).json({ jobId });

    // Process job asynchronously (fire and forget on Vercel)
    processJobAsync(jobId, youtubeUrl, options).catch(err => {
      console.error('Job processing error:', err);
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to enqueue video' });
  }
});

// GET /api/jobs/:id/status
app.get('/api/jobs/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await getJobStatus(id);
    if (!job) return res.status(404).json({ error: 'job not found' });
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: 'Unable to fetch status' });
  }
});

// GET /api/videos/:id
app.get('/api/videos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await getJobStatus(id);
    if (!job) return res.status(404).json({ error: 'job not found' });
    res.json(job.result || {});
  } catch (err: any) {
    res.status(500).json({ error: 'Unable to fetch video' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Main processing function (async, runs after response sent)
async function processJobAsync(jobId: string, youtubeUrl: string, options: any) {
  try {
    // Stage 1: Ingestion
    await updateJob(jobId, { status: 'processing', progress: 5 });
    const metadata = await fetchMetadata(youtubeUrl);
    await updateJob(jobId, { progress: 20 });

    // Download video
    const videoId = metadata.title.replace(/\W+/g, '_') + '_' + Date.now();
    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const dest = path.join(tmpDir, `${videoId}.mp4`);

    await downloadVideo(youtubeUrl, dest);
    await updateJob(jobId, { progress: 50 });

    // Stage 2: Transcription
    const transcript = await transcribeWithWhisper(dest);
    await updateJob(jobId, { progress: 70 });

    // Stage 3: Analysis
    const clips = detectViralClips(transcript);
    await updateJob(jobId, { progress: 80 });

    // Stage 4: Rendering
    const outputs: string[] = [];
    for (let i = 0; i < Math.min(3, clips.length); i++) {
      const clip = clips[i];
      const outName = `${videoId}_clip${i}.mp4`;
      const outPath = path.join(tmpDir, outName);

      const cmd = `ffmpeg -y -i "${dest}" -ss ${clip.start} -to ${clip.end} -c:v libx264 -c:a aac "${outPath}"`;
      await runFfmpeg(cmd);
      outputs.push(outPath);
    }

    // Stage 5: Upload
    if (outputs.length > 0) {
      const buffer = fs.readFileSync(outputs[0]);
      await uploadFile('videos', path.basename(outputs[0]), buffer);
      const publicUrl = getPublicUrl('videos', path.basename(outputs[0]));

      // Stage 6: AI Team
      const titles = await generateTitles(transcript);
      const tags = await generateTags(transcript);

      await updateJob(jobId, {
        status: 'completed',
        progress: 100,
        result: {
          videoUrl: publicUrl,
          titles,
          tags,
          transcript
        }
      });
    }

  } catch (err: any) {
    console.error('Job error:', err);
    await updateJob(jobId, {
      status: 'failed',
      error: err.message
    });
  }
}

export default app;
