-- ====================================================================
-- SCHOOLZZ ATTENDANCE MANAGEMENT SYSTEM - LOGIN TABLES SCHEMA
-- Compatible with PostgreSQL & Supabase Database
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- TABLE 1: PRINCIPALS LOGIN TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.principals_login (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    principal_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    username VARCHAR(80) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    school_name VARCHAR(150) DEFAULT 'Delhi Public School',
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- TABLE 2: TEACHERS LOGIN TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teachers_login (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    username VARCHAR(80) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    assigned_classes JSONB DEFAULT '[]'::jsonb, -- e.g. ["10-A_morning", "10-B_afternoon"]
    department VARCHAR(80) DEFAULT 'General Education',
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- TABLE 3: STUDENTS LOGIN TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students_login (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    roll_no INTEGER NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    class_id VARCHAR(50) NOT NULL, -- e.g. "10-A_morning"
    username VARCHAR(80) UNIQUE NOT NULL,
    passcode VARCHAR(50) NOT NULL DEFAULT '123456', -- Student PIN/Passcode for quick login
    password_hash TEXT,
    parent_phone VARCHAR(20) NOT NULL,
    gender VARCHAR(10) DEFAULT 'Female',
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'TRANSFERRED')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- UNIFIED LOGIN VIEW FOR EASY AUTHENTICATION QUERIES
-- --------------------------------------------------------------------
CREATE OR REPLACE VIEW public.unified_user_logins AS
SELECT 
    id,
    principal_id AS user_code,
    full_name,
    email,
    username,
    password_hash,
    'PRINCIPAL' AS role,
    status,
    last_login_at,
    created_at
FROM public.principals_login

UNION ALL

SELECT 
    id,
    teacher_id AS user_code,
    full_name,
    email,
    username,
    password_hash,
    'TEACHER' AS role,
    status,
    last_login_at,
    created_at
FROM public.teachers_login

UNION ALL

SELECT 
    id,
    student_id AS user_code,
    full_name,
    parent_phone AS email,
    username,
    COALESCE(password_hash, passcode) AS password_hash,
    'STUDENT' AS role,
    status,
    last_login_at,
    created_at
FROM public.students_login;

-- --------------------------------------------------------------------
-- INITIAL SEED DATA FOR ALL ROLES
-- --------------------------------------------------------------------

-- 1. Seed Principal Login
INSERT INTO public.principals_login (principal_id, full_name, email, username, password_hash, school_name, phone)
VALUES 
    ('PRIN-001', 'Dr. Rajesh Sharma', 'principal@schoolzz.edu', 'principal', 'principal123', 'Delhi Public School', '+91 98765 43210')
ON CONFLICT (principal_id) DO NOTHING;

-- 2. Seed Teachers Login
INSERT INTO public.teachers_login (teacher_id, full_name, email, username, password_hash, assigned_classes, department, phone)
VALUES 
    ('TCH-001', 'Mr. Sharma (Teacher 1)', 'sharma@schoolzz.edu', 'teacher1', 'teacher123', '["10-A_morning", "10-B_afternoon"]'::jsonb, 'Mathematics', '+91 98123 45678'),
    ('TCH-002', 'Mrs. Kapoor (Teacher 2)', 'kapoor@schoolzz.edu', 'teacher2', 'teacher123', '["9-A_morning", "10-A_afternoon"]'::jsonb, 'Science', '+91 98123 45679')
ON CONFLICT (teacher_id) DO NOTHING;

-- 3. Seed Sample Students Login
INSERT INTO public.students_login (student_id, roll_no, full_name, class_id, username, passcode, parent_phone, gender)
VALUES 
    ('STU-10A-01', 1, 'Isha Kapoor', '10-A_morning', 'isha.kapoor', '1001', '+91 97222 22201', 'Female'),
    ('STU-10A-02', 2, 'Kabir Das', '10-A_morning', 'kabir.das', '1002', '+91 97222 22202', 'Male'),
    ('STU-10A-03', 3, 'Aanya Sen', '10-A_morning', 'aanya.sen', '1003', '+91 97222 22203', 'Female'),
    ('STU-10A-04', 4, 'Vihaan Mehta', '10-A_morning', 'vihaan.mehta', '1004', '+91 97222 22204', 'Male'),
    ('STU-10A-05', 5, 'Ananya Roy', '10-A_morning', 'ananya.roy', '1005', '+91 97222 22205', 'Female')
ON CONFLICT (student_id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.principals_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students_login ENABLE ROW LEVEL SECURITY;

-- Permissive policies for demo app access
CREATE POLICY "Allow public read access to principals_login" ON public.principals_login FOR SELECT USING (true);
CREATE POLICY "Allow public read access to teachers_login" ON public.teachers_login FOR SELECT USING (true);
CREATE POLICY "Allow public read access to students_login" ON public.students_login FOR SELECT USING (true);
