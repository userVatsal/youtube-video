export function detectViralClips(transcript: string): Array<{start: string; end: string}> {
  const sentences = transcript.split(/(?<=[\.\?\!])\s+/);
  const scored = sentences.map((s, idx) => ({
    text: s,
    idx,
    score: (s.match(/[\!\?]/g)?.length || 0) * 2 + s.length / 10,
  }));
  scored.sort((a, b) => b.score - a.score);
  
  return scored.slice(0, 3).map(s => {
    const startSec = Math.max(0, s.idx * 10);
    const endSec = Math.min(300, startSec + 8);
    return {
      start: `00:00:${startSec.toString().padStart(2, '0')}`,
      end: `00:00:${endSec.toString().padStart(2, '0')}`
    };
  });
}
