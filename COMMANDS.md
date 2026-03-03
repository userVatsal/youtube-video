# 📋 Exact Commands to Deploy

Follow these commands **in order** to deploy AutoTube AI Studio to Vercel + Supabase.

---

## Prerequisites

- You have GitHub account
- You have Vercel account (link to GitHub)
- You have Supabase account with project `hungnwkolnbzjziogrvw`
- You have YouTube, OpenAI API keys ready

---

## Command Set 1: Supabase (Do in Supabase Console)

**Go to:** https://app.supabase.com → Select project `hungnwkolnbzjziogrvw`

**Step 1:** Create database tables

1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. **Paste entire `migration.sql` file** (copy from repo)
4. Click **Run** (blue button)
5. Wait ~5 seconds, see "Success"

**Step 2:** Create storage bucket

1. Click **Storage** (left sidebar)
2. Click **Create new bucket**
3. Name: `videos`
4. Check **Public bucket**
5. Click **Create bucket**
6. Done!

---

## Command Set 2: Git Push (Terminal)

```bash
# Navigate to repo
cd "C:\Users\userV\Downloads\youtube video"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial AutoTube AI Studio – Vercel + Supabase"

# Add remote (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/youtube-video.git

# Push to GitHub
git push -u origin master
```

**After this runs successfully:**
- Repo visible at `https://github.com/YOUR_USERNAME/youtube-video`

---

## Command Set 3: Vercel Deploy (Do in Vercel Console + CLI)

**Option A: Deploy via Vercel Web Console (Easiest)**

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Select your `youtube-video` repo
5. Click **Import**
6. **Root Directory**: leave as `.`
7. Click **Deploy**
8. **Wait 2-3 minutes** for build to complete

**After deployment succeeds:**

9. In Vercel dashboard, go to **Settings** → **Environment Variables**
10. Click **Add New** for each secret below (click the lock icon):

```
SUPABASE_URL = https://hungnwkolnbzjziogrvw.supabase.co
SUPABASE_KEY = sb_publishable_LEDggnWdouUwTchg8MyErw_TBqPLmqR
YOUTUBE_API_KEY = (paste your YouTube API key)
YOUTUBE_CLIENT_ID = <YOUR_YOUTUBE_CLIENT_ID>
YOUTUBE_CLIENT_SECRET = <YOUR_YOUTUBE_CLIENT_SECRET>
OPENAI_API_KEY = sk-... (paste your real OpenAI key)
CLAUDE_API_KEY = (paste your Claude key or dummy value)
```

11. After adding all 7 environment variables, go to **Deployments**
12. Click your latest deployment
13. Click **Redeploy**
14. **Wait 2-3 minutes** for it to rebuild with env vars

**After redeploy completes:**
- Your site is live at `https://YOUR_PROJECT_NAME.vercel.app`
- See the deployment URL in Vercel dashboard

---

## ✅ Your Live Site is Ready!

Visit: **`https://YOUR_PROJECT_NAME.vercel.app`**

Replace `YOUR_PROJECT_NAME` with the name Vercel assigned (e.g., `youtube-video-9k2l.vercel.app`)

---

## Test It

1. Open your live URL
2. Paste a YouTube link (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Click **Generate**
4. Watch status update
5. When complete, click **View generated video**

---

## Optional: Local Testing (Before Production)

If you want to test locally first:

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend (new terminal window)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` and test the same way.

---

## Troubleshooting Commands

**Check if Git is working:**
```bash
git remote -v
```

**See GitHub status:**
```bash
git status
```

**Check Node version (must be 18+):**
```bash
node -v
npm -v
```

---

## All Done! 🎉

You now have a production-ready AutoTube AI Studio deployed on Vercel + Supabase.

**Next:** Share your URL with anyone. They can paste YouTube links and get auto-generated clips back!

---

**Questions?** See detailed docs in [DEPLOY.md](./DEPLOY.md) and [CHECKLIST.md](./CHECKLIST.md)
