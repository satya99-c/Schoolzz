-- ========================================================
-- SCHOOLZZ SMART ATTENDANCE - SUPABASE DATABASE SCHEMA
-- Copy and paste this script into Supabase SQL Editor
-- ========================================================

-- 1. Create Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  shift TEXT NOT NULL,
  shift_time TEXT NOT NULL,
  class_teacher TEXT NOT NULL,
  total_students INT DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
  roll_no INT NOT NULL,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  photo TEXT,
  parent_phone TEXT NOT NULL,
  attendance_pct INT DEFAULT 90,
  days_present INT DEFAULT 23,
  days_absent NUMERIC(4,1) DEFAULT 1.5,
  days_leave NUMERIC(4,1) DEFAULT 0.5,
  pre_planned_leave BOOLEAN DEFAULT FALSE,
  leave_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Teachers Table
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

-- 4. Create Attendance Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY, -- format: {class_id}_{yyyy-mm-dd}
  class_id TEXT NOT NULL,
  submission_date DATE DEFAULT CURRENT_DATE,
  timestamp TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'DECLINED')),
  decline_reason TEXT,
  records JSONB NOT NULL,
  stats JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create Daily Analytics Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY, -- format: report_{class_id}_{yyyy-mm-dd}
  class_id TEXT NOT NULL,
  report_date DATE DEFAULT CURRENT_DATE,
  total_students INT NOT NULL,
  present_count INT NOT NULL,
  absent_count INT NOT NULL,
  leave_count INT NOT NULL,
  attendance_pct NUMERIC(5,2) NOT NULL,
  teacher_name TEXT NOT NULL,
  status TEXT DEFAULT 'APPROVED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Create WhatsApp Alert Logs Table
CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  roll_no INT NOT NULL,
  class_id TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Sent to WhatsApp',
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present to avoid errors
DROP POLICY IF EXISTS "Allow public all access to classes" ON classes;
DROP POLICY IF EXISTS "Allow public all access to students" ON students;
DROP POLICY IF EXISTS "Allow public all access to teachers" ON teachers;
DROP POLICY IF EXISTS "Allow public all access to submissions" ON submissions;
DROP POLICY IF EXISTS "Allow public all access to reports" ON reports;
DROP POLICY IF EXISTS "Allow public all access to whatsapp_logs" ON whatsapp_logs;

-- Create Policies
CREATE POLICY "Allow public all access to classes" ON classes FOR ALL USING (true);
CREATE POLICY "Allow public all access to students" ON students FOR ALL USING (true);
CREATE POLICY "Allow public all access to teachers" ON teachers FOR ALL USING (true);
CREATE POLICY "Allow public all access to submissions" ON submissions FOR ALL USING (true);
CREATE POLICY "Allow public all access to reports" ON reports FOR ALL USING (true);
CREATE POLICY "Allow public all access to whatsapp_logs" ON whatsapp_logs FOR ALL USING (true);

-- Enable Supabase Real-Time Replication
ALTER PUBLICATION supabase_realtime ADD TABLE classes;
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE teachers;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_logs;
