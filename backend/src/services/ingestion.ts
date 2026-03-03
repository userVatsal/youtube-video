import axios from 'axios';
import ytdl from 'ytdl-core';
import fs from 'fs';

export function validateYouTubeUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?youtube\.com/.test(url) || /^https?:\/\/(youtu\.be)\//.test(url);
}

export async function fetchMetadata(url: string): Promise<any> {
  const match = url.match(/(?:v=|youtu\.be\/)([\\w-]{11})/);
  if (!match) throw new Error('invalid youtube url');
  const videoId = match[1];
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('YOUTUBE_API_KEY not set');
  const resp = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      part: 'snippet,statistics,contentDetails',
      id: videoId,
      key: apiKey,
    },
  });
  const item = resp.data.items && resp.data.items[0];
  if (!item) throw new Error('video not found');
  return {
    title: item.snippet.title,
    description: item.snippet.description,
    tags: item.snippet.tags || [],
    publishedAt: item.snippet.publishedAt,
    views: item.statistics.viewCount,
    duration: item.contentDetails.duration,
  };
}

export async function downloadVideo(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ytdl(url, { quality: 'highest' })
      .pipe(fs.createWriteStream(destPath))
      .on('finish', () => resolve())
      .on('error', reject);
  });
}
