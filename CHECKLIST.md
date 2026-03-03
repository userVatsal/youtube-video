# 🚀 Deployment Checklist

Complete these steps in order to deploy your AutoTube AI Studio to Vercel + Supabase.

---

## Phase 1: Supabase Setup (5 mins)

- [ ] Open [Supabase Console](https://app.supabase.com)
- [ ] Go to your project `hungnwkolnbzjziogrvw`
- [ ] Go to **SQL Editor** (left sidebar)
- [ ] Create new query and paste **Complete** code from `migration.sql`
- [ ] Click **Run** to create `jobs` and `videos` tables
- [ ] Go to **Storage** (left sidebar)
- [ ] Click **Create new bucket**
- [ ] Name: `videos`, check "Public bucket", click **Create bucket**

✅ **Result**: PostgreSQL tables + S3-compatible storage bucket ready

---

## Phase 2: GitHub Setup (5 mins)

- [ ] Initialize Git and push repo:

```bash
cd "C:\Users\userV\Downloads\youtube video"
git init
git add .
git commit -m "Initial AutoTube AI Studio commit"
git remote add origin https://github.com/YOUR_USERNAME/youtube-video.git
git push -u origin master
```

✅ **Result**: Code pushed to GitHub, ready for Vercel import

---

## Phase 3: Vercel Deployment (10 mins)

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click **New Project**
- [ ] Select your `youtube-video` repo from GitHub
- [ ] **Root Directory**: `.` (leave default)
- [ ] Click **Deploy**
- [ ] After deployment (1-2 mins), go to **Settings** → **Environment Variables**
- [ ] Add all secrets:

```
SUPABASE_URL = https://hungnwkolnbzjziogrvw.supabase.co
SUPABASE_KEY = sb_publishable_LEDggnWdouUwTchg8MyErw_TBqPLmqR
YOUTUBE_API_KEY = YOUR_YOUTUBE_KEY
YOUTUBE_CLIENT_ID = <YOUR_YOUTUBE_CLIENT_ID>
YOUTUBE_CLIENT_SECRET = <YOUR_YOUTUBE_CLIENT_SECRET>
OPENAI_API_KEY = sk-YOUR_REAL_KEY
CLAUDE_API_KEY = YOUR_REAL_KEY
```

- [ ] Redeploy by going to **Deployments** → click your latest → click **Redeploy**

✅ **Result**: Frontend + Backend live on Vercel at `https://YOUR_PROJECT.vercel.app`

---

## Phase 4: Optional – Local Testing (10 mins)

If you want to test before production:

- [ ] In `backend/.env`, add all the keys from Phase 3
- [ ] Start backend:

```bash
cd backend
npm install
npm run dev
```

- [ ] In another terminal, start frontend:

```bash
cd frontend
npm install
npm run dev
```

- [ ] Visit `http://localhost:3000`
- [ ] Paste a YouTube link and click **Generate**
- [ ] Watch status updates, wait for "completed"
- [ ] Click the generated video link

✅ **Result**: Full pipeline tested locally

---

## ✅ You're Done!

Your live site is at: **https://YOUR_PROJECT.vercel.app**

**Next steps:**
1. Share the link with anyone
2. They can paste YouTube links and get rendered videos back
3. All videos are stored in your Supabase bucket
4. Costs: Whisper API (~$0.01/min) + Supabase storage + Vercel compute

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Vercel build failed" | Check `SUPABASE_URL` and `SUPABASE_KEY` are set as secrets (not variables) |
| "Database error 401" | Verify Supabase credentials in env vars |
| "No videos bucket" | Go to Supabase Storage and create bucket named `videos` (must be public) |
| "Job stuck processing" | Vercel functions timeout after 10s; renders must complete quickly |
| "YouTube API error" | Check `YOUTUBE_API_KEY` has quota and is valid |

---

**Questions?** Check [DEPLOY.md](./DEPLOY.md) for detailed explanations and architecture notes.
