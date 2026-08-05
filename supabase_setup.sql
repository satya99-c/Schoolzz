-- ==============================================================================
-- UNIFIED MULTI-TENANT DATABASE SCHEMA (NO DYNAMIC TABLES NEEDED)
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
  code text PRIMARY KEY,
  name text NOT NULL,
  city text,
  admin_name text,
  admin_email text,
  registered_at timestamp with time zone DEFAULT now()
);

-- 2. Principals Table
CREATE TABLE IF NOT EXISTS principals (
  id text PRIMARY KEY,
  name text NOT NULL,
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'principal',
  school_code text REFERENCES organizations(code),
  organization text,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
  id text PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'teacher',
  avatar text DEFAULT '👨‍🏫',
  assigned_classes jsonb DEFAULT '[]'::jsonb,
  school_code text,
  organization text,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id text PRIMARY KEY,
  name text NOT NULL,
  shift text,
  shift_time text,
  class_teacher text,
  total_students integer DEFAULT 0,
  school_code text,
  organization text,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Students Table
CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  class_id text,
  roll_no integer,
  name text NOT NULL,
  gender text,
  photo text,
  parent_phone text,
  attendance_pct numeric DEFAULT 90,
  days_present numeric DEFAULT 23,
  days_absent numeric DEFAULT 1.5,
  days_leave numeric DEFAULT 0.5,
  school_code text,
  organization text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable full read/write access for API roles
GRANT ALL ON TABLE organizations TO anon, authenticated, service_role;
GRANT ALL ON TABLE principals TO anon, authenticated, service_role;
GRANT ALL ON TABLE teachers TO anon, authenticated, service_role;
GRANT ALL ON TABLE classes TO anon, authenticated, service_role;
GRANT ALL ON TABLE students TO anon, authenticated, service_role;

ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE principals DISABLE ROW LEVEL SECURITY;
ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
