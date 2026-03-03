import { Job } from 'bullmq';
import { updateJob } from '../../models/job';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import { uploadFile, getPublicUrl } from '../../services/storage';

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

export async function processRender(job: Job) {
  const { videoId, clips, style, jobId } = job.data as any;
  updateJob(jobId, { progress: 95 });
  console.log('Render job started', jobId);
  try {
    // assume source file in tmp folder
    const src = path.join(__dirname, '../../../tmp', `${videoId}.mp4`);
    const outputs: string[] = [];
    // create temporary subtitle file based on clips/text if available
    const subtitlePath = path.join(__dirname, '../../../tmp', `${videoId}.srt`);
    if (job.data.transcript) {
      const lines = (job.data.transcript as string).split(/(?<=[\.\?\!])\s+/);
      let time = 0;
      const srtLines: string[] = [];
      lines.forEach((line, idx) => {
        const start = new Date(time * 1000).toISOString().substr(11, 8).replace('.', ',');
        time += Math.max(2, line.split(' ').length * 0.5);
        const end = new Date(time * 1000).toISOString().substr(11, 8).replace('.', ',');
        srtLines.push(`${idx+1}`);
        srtLines.push(`${start} --> ${end}`);
        srtLines.push(line.trim());
        srtLines.push('');
      });
      fs.writeFileSync(subtitlePath, srtLines.join('\n'));
    }
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const outName = `${videoId}_clip${i}.mp4`;
      const outPath = path.join(__dirname, '../../../tmp', outName);
      // simple trim
      let cmd = `ffmpeg -y -i "${src}" -ss ${clip.start} -to ${clip.end}`;
      if (fs.existsSync(subtitlePath)) {
        cmd += ` -vf subtitles="${subtitlePath}"`;
      }
      cmd += ` -c:v libx264 -c:a aac "${outPath}"`;
      await runFfmpeg(cmd);
      outputs.push(outPath);
    }
    // upload first clip as example
    const buffer = fs.readFileSync(outputs[0]);
    const uploadRes = await uploadFile('videos', path.basename(outputs[0]), buffer);
    const publicUrl = getPublicUrl('videos', path.basename(outputs[0]));
    updateJob(jobId, { status: 'completed', progress: 100, result: { videoUrl: publicUrl } });
  } catch (err: any) {
    console.error(err);
    updateJob(jobId, { status: 'failed', error: err.message });
    throw err;
  }
}
