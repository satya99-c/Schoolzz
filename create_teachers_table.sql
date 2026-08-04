-- ========================================================
-- SCHOOLZZ SMART ATTENDANCE - SUPABASE RLS & SETUP SCRIPT
-- Copy and paste this into Supabase SQL Editor & click Run
-- ========================================================

-- 1. Create Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'teacher',
  avatar TEXT DEFAULT '👨‍🏫',
  assigned_classes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if present to prevent duplicate policy errors
DROP POLICY IF EXISTS "Allow public all access to classes" ON classes;
DROP POLICY IF EXISTS "Allow public read access to classes" ON classes;
DROP POLICY IF EXISTS "Allow public all access to students" ON students;
DROP POLICY IF EXISTS "Allow public all access to teachers" ON teachers;
DROP POLICY IF EXISTS "Allow public all access to submissions" ON submissions;
DROP POLICY IF EXISTS "Allow public all access to whatsapp_logs" ON whatsapp_logs;

-- 4. Create Public Access Policies
CREATE POLICY "Allow public all access to classes" ON classes FOR ALL USING (true);
CREATE POLICY "Allow public all access to students" ON students FOR ALL USING (true);
CREATE POLICY "Allow public all access to teachers" ON teachers FOR ALL USING (true);
CREATE POLICY "Allow public all access to submissions" ON submissions FOR ALL USING (true);
CREATE POLICY "Allow public all access to whatsapp_logs" ON whatsapp_logs FOR ALL USING (true);

-- 5. Enable Supabase Real-Time Subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE classes;
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE teachers;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_logs;
