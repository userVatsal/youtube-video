# AutoTube AI Studio

**AI-powered YouTube video production pipeline**: paste a link, automatically download, transcribe, analyze, render clips with subtitles, and upload to cloud storage.

## 🚀 Quick Start

```bash
# 1. Setup database
# Run migration.sql in your Supabase console

# 2. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# 3. Local testing
cd backend && npm install && npm run dev
cd ../frontend && npm install && npm run dev
# Visit http://localhost:3000

# 4. Deploy to Vercel
# See DEPLOY.md for detailed instructions
git push origin master
```

## 📋 Architecture

- **Frontend**: React + Vite + TailwindCSS (→ Vercel)
- **Backend**: Express + Vercel Serverless Functions
- **Database**: Supabase PostgreSQL (`jobs`, `videos` tables)
- **Storage**: Supabase Storage bucket (`videos`)
- **Video Processing**: FFmpeg, YouTube API, OpenAI Whisper

## 🎬 Pipeline

1. **Ingest** – Download video, fetch YouTube metadata
2. **Transcribe** – Convert audio to text (Whisper API)
3. **Analyze** – Detect viral moments, segment transcript
4. **Render** – Trim clips, burn subtitles, re-encode (FFmpeg)
5. **Upload** – Store to Supabase, return public URL
6. **AI Team** – Generate titles, tags, descriptions

## 🛠 Environment Variables

Required in `backend/.env`:

```ini
SUPABASE_URL=https://hungnwkolnbzjziogrvw.supabase.co
SUPABASE_KEY=sb_publishable_LEDggnWdouUwTchg8MyErw_TBqPLmqR
YOUTUBE_API_KEY=...
OPENAI_API_KEY=...
CLAUDE_API_KEY=...
```

## 📚 Documentation

- **[DEPLOY.md](DEPLOY.md)** – Step-by-step deployment to Vercel + Supabase
- **[migration.sql](migration.sql)** – Database schema
- **Backend services** in `backend/src/services/`
  - `ingestion.ts` – YouTube API, video download
  - `transcript.ts` – Whisper API
  - `viral.ts` – Clip detection heuristics
  - `style.ts` – Claude prompt integration
  - `render.ts` – FFmpeg commands
  - `storage.ts` – Supabase uploads

## 🔄 Local Development

Requirements:
- Node 18+
- FFmpeg installed (`ffmpeg -version`)
- Supabase project + bucket created

Run backend (processes jobs synchronously):
```bash
cd backend
npm install
npm run dev
```

Run frontend (React dev server):
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` → paste YouTube link → watch processing.

## ☁️ Production (Vercel)

See **[DEPLOY.md](DEPLOY.md)** for:
- Supabase database setup
- Vercel environment secrets
- Domain configuration
- Troubleshooting

## 📦 Tech Stack

| Component | Tech |
|-----------|------|
| Frontend | React 18, Vite, TailwindCSS |
| Backend | Express, TypeScript, Vercel Functions |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage (S3-compatible) |
| Video | FFmpeg, YT-DL Core, Whisper API |
| UI | React Hooks, Axios |

## 🎯 Use Cases

- Generate **YouTube Shorts** from long-form videos
- Create **TikTok/Instagram** clips with auto-subtitles
- **Re-purpose content** across platforms
- **Personal archival** with AI-generated metadata

## ⚠️ Legal

- Respect YouTube ToS and copyright
- Only process videos you own or have permission to transform
- See [legal considerations](./DEPLOY.md#legal) in docs

## 📝 License

Personal use. Modify as needed.

---

**Ready to deploy?** → See [DEPLOY.md](DEPLOY.md)


```