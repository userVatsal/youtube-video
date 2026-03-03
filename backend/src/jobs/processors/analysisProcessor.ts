import { Job } from 'bullmq';

import { enqueueRenderJob, enqueueAiTeamJob } from '../queue';
import { updateJob } from '../../models/job';

// simple heuristic functions
function segmentTranscript(text: string) {
  const sentences = text.split(/(?<=[\.\?\!])\s+/);
  return sentences.map((s, idx) => ({ text: s, idx }));
}

function detectViralSegments(segments: {text: string;idx:number}[]) {
  // choose top 3 longest sentences with exclamation or question marks
  const scored = segments.map(s => ({
    ...s,
    score: (s.text.match(/[\!\?]/g)?.length || 0) * 2 + s.text.length / 10,
  }));
  scored.sort((a,b)=>b.score-a.score);
  return scored.slice(0,3).map(s => ({ start: `00:00:${(s.idx*10).toString().padStart(2,'0')}`, end: `00:00:${(s.idx*10+8).toString().padStart(2,'0')}` }));
}

export async function processAnalysis(job: Job) {
  const { videoId, transcript, jobId } = job.data as any;
  updateJob(jobId, { progress: 85 });
  console.log('Analysis job started', jobId);
  try {
    const segments = segmentTranscript(transcript);
    const clips = detectViralSegments(segments);
    const style = job.data.options?.style || { preset: 'default' };
    // enqueue render and aiTeam
    await enqueueRenderJob({ videoId, clips, style, jobId, transcript });
    await enqueueAiTeamJob({ videoId, script: transcript, jobId });
    updateJob(jobId, { progress: 90 });
  } catch (err: any) {
    console.error(err);
    updateJob(jobId, { status: 'failed', error: err.message });
    throw err;
  }
}
