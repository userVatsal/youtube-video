import React, { useState } from 'react';
import axios from 'axios';

// Use Vercel API URL, or localhost for dev
const API_URL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin);

export default function Home() {
  const [url, setUrl] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${API_URL}/api/videos`, { youtubeUrl: url, options: {} });
      const id = resp.data.jobId;
      setJobId(id);
      setStatus('queued');
      setVideoUrl(null);
      // start polling
      pollStatus(id);
    } catch (err) {
      console.error(err);
      setStatus('error: ' + (err as any).message);
    }
  };

  const pollStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const resp = await axios.get(`${API_URL}/api/jobs/${id}/status`);
        setStatus(resp.data.status + ' ' + resp.data.progress + '%');
        if (resp.data.status === 'completed') {
          clearInterval(interval);
          if (resp.data.result?.videoUrl) {
            setVideoUrl(resp.data.result.videoUrl);
          }
        }
        if (resp.data.status === 'failed') {
          clearInterval(interval);
          setStatus('failed: ' + resp.data.error);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AutoTube AI Studio</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Paste YouTube link"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Generate
        </button>
      </form>
      {jobId && <p className="mt-4 text-sm text-gray-600">Job ID: {jobId}</p>}
      {status && <p className="mt-2">Status: {status}</p>}
      {videoUrl && (
        <div className="mt-4">
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View generated video
          </a>
        </div>
      )}
    </div>
  );
}
