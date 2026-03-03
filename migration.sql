-- Run this SQL in your Supabase console

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

-- Enable RLS (optional but recommended for security)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for testing (remove in production)
CREATE POLICY "jobs_public" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "videos_public" ON videos FOR ALL USING (true) WITH CHECK (true);
