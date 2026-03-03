# AutoTube AI Studio

Monorepo with frontend (React/Vite) and backend (Node/Express + BullMQ).

## Backend

1. Create `.env` from `.env.example` and fill in YouTube API key, Supabase credentials, OpenAI and Claude keys.  
   You also need a running Redis instance (`redis://127.0.0.1:6379` by default) and an existing Supabase bucket named `videos`.
2. Install dependencies and build:

```bash
cd backend
npm install
npm run build
# or for development
npm run dev
```

The backend starts on port 4000 and will automatically spin up the BullMQ workers.

> **Prerequisite:** ffmpeg must be installed and available on your PATH (`ffmpeg -version`).

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on port 3000 and proxies `/api` to your backend.

### Workflow

1. Paste a YouTube link in the form and click "Generate".
2. The backend will download the video, transcribe it via Whisper, perform simple analysis, render a trimmed clip with burned subtitles, upload it to Supabase, and return a public URL.
3. Polling updates will show progress; when complete you can click the generated video link.

This repository is intended for personal use; all data and jobs are stored in memory and temporary disk.

```