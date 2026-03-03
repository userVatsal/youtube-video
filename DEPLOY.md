# AutoTube AI Studio – Deployment & Setup Guide

## Architecture

- **Frontend**: React app deployed to Vercel (static + serverless)
- **Backend**: Express app running as Vercel API routes
- **Database**: Supabase PostgreSQL stores jobs and results
- **Storage**: Supabase Storage bucket (`videos`) holds rendered video files

---

## Prerequisites

1. **GitHub account** – push your repo there
2. **Vercel account** – connected to GitHub
3. **Supabase project** – already created at `hungnwkolnbzjziogrvw.supabase.co`
4. **API Keys**:
   - YouTube API key
   - OpenAI API key (for Whisper transcription)
   - Claude API key (optional, for style rewriting)

---

## Step 1: Set up Supabase Database

1. Go to your Supabase project console at [supabase.co](https://supabase.co)
2. Open the **SQL Editor** (left sidebar)
3. Create a new query and paste the contents of `migration.sql`:

```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  result JSONB,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  url TEXT,
  title TEXT,
  transcript TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_public" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "videos_public" ON videos FOR ALL USING (true) WITH CHECK (true);
```

4. Click **Run** to create the tables.
5. Go to **Storage** (left sidebar) → **Create new bucket**
   - Name: `videos`
   - Check "Public bucket"
   - Click **Create bucket**

---

## Step 2: Create Supabase Storage Bucket

1. In Supabase console, go to **Storage**
2. Click **Create new bucket**
3. Name it `videos` and make it public
4. Click **Create bucket**

---

## Step 3: Update Environment Variables

### For Local Testing

Create `.env` in the `backend` folder:

```ini
PORT=3000
SUPABASE_URL=https://hungnwkolnbzjziogrvw.supabase.co
SUPABASE_KEY=sb_publishable_LEDggnWdouUwTchg8MyErw_TBqPLmqR
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
YOUTUBE_CLIENT_ID=<YOUR_YOUTUBE_CLIENT_ID>
YOUTUBE_CLIENT_SECRET=<YOUR_YOUTUBE_CLIENT_SECRET>
OPENAI_API_KEY=sk-YOUR_REAL_KEY
CLAUDE_API_KEY=YOUR_REAL_KEY
```

### For Vercel Deployment

1. Go to your Vercel project settings → **Environment Variables**
2. Add each key as a secret (click the lock icon):
   - `SUPABASE_URL`: `https://hungnwkolnbzjziogrvw.supabase.co`
   - `SUPABASE_KEY`: `sb_publishable_LEDggnWdouUwTchg8MyErw_TBqPLmqR`
   - `YOUTUBE_API_KEY`: (your key)
   - `YOUTUBE_CLIENT_ID`: (your ID)
   - `YOUTUBE_CLIENT_SECRET`: (your secret)
   - `OPENAI_API_KEY`: (your key)
   - `CLAUDE_API_KEY`: (your key)

---

## Step 4: Deploy Frontend to Vercel

1. **Push your repository to GitHub**:

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/youtube-video.git
git push -u origin master
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click **New Project**
   - Import your GitHub repo
   - Set the root directory to `.` (repo root)
   - Click **Deploy**

3. **Add environment variables**:
   - In Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add all keys from Step 3 above as secrets

4. Once deployment completes, your site will be live at `https://your-project.vercel.app`

---

## Step 5: Test Locally (Optional)

If you want to test before deploying:

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` and paste a YouTube link.

---

## Step 6: Run End-to-End

1. **Paste a YouTube link** in the frontend form (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`).
2. **Click "Generate"** – the job ID appears immediately.
3. **Watch the status update** – progress bar shows:
   - `queued` → `processing 20%` → `processing 70%` → ... → `completed`
4. **When complete** – a "View generated video" link appears.
5. **Click the link** to download your rendered clip from Supabase Storage.

---

## Troubleshooting

### "API returned 401 error"
- Check your Supabase URL and key are correct.
- Verify the `videos` bucket exists and is public.

### "Unable to transcribe"
- Ensure `OPENAI_API_KEY` is set and has quota available.
- The video must have audio or Whisper will fail.

### "FFmpeg not found"
- On Vercel, ffmpeg-static is bundled automatically – no action needed.
- Locally, install ffmpeg: `choco install ffmpeg` (Windows) or `brew install ffmpeg` (Mac).

### "Job stuck in processing"
- Vercel Serverless Functions timeout after 10 seconds by default.
- Rendering only works for very short clips; longer videos may fail.
- Consider running a worker locally for large renders.

---

## Scaling Tips

1. **For longer videos** – host a background worker on Heroku/Railway instead of relying on serverless.
2. **For more concurrent jobs** – upgrade Supabase plan to increase connection limits.
3. **For custom AI** – replace the naive clip detection with Claude prompts in `src/services/viral.ts`.
4. **For multiple formats** – add more output configurations in the render processor.

---

## Support

Refer to the architecture diagram and code comments in each processor file (`ingestionProcessor.ts`, `analysisProcessor.ts`, `renderProcessor.ts`, `aiTeamProcessor.ts`) for customization.
