-- ==============================================================================
-- 🚀 SCHOOLZZ SUPABASE DATABASE TABLE MIGRATION & CREATION SCRIPT
-- Run this SQL in your Supabase Dashboard -> SQL Editor to add new columns to existing tables.
-- ==============================================================================

-- 1. 🛠️ ALTER EXISTING TABLES TO ADD NEW COLUMNS (RUN THIS FOR PRE-EXISTING TABLES)
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS teacher_id TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '👨‍🏫';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS assigned_classes JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.teachers_login ADD COLUMN IF NOT EXISTS teacher_id TEXT;
ALTER TABLE public.teachers_login ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.teachers_login ADD COLUMN IF NOT EXISTS school_code TEXT DEFAULT 'SCH1';

ALTER TABLE public.principals ADD COLUMN IF NOT EXISTS principal_id TEXT;
ALTER TABLE public.principals ADD COLUMN IF NOT EXISTS organization TEXT;

ALTER TABLE public.principals_login ADD COLUMN IF NOT EXISTS principal_id TEXT;
ALTER TABLE public.principals_login ADD COLUMN IF NOT EXISTS school_name TEXT;

ALTER TABLE public.students ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS passcode TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT true;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS fee_info JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.students_login ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE public.students_login ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.students_login ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT true;

ALTER TABLE public.student_fees ADD COLUMN IF NOT EXISTS total_fee NUMERIC DEFAULT 45000;
ALTER TABLE public.student_fees ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 5000;
ALTER TABLE public.student_fees ADD COLUMN IF NOT EXISTS net_fee NUMERIC DEFAULT 40000;
ALTER TABLE public.student_fees ADD COLUMN IF NOT EXISTS paid_amount NUMERIC DEFAULT 0;
ALTER TABLE public.student_fees ADD COLUMN IF NOT EXISTS due_amount NUMERIC DEFAULT 40000;

-- ==============================================================================
-- 2. 📋 CREATE TABLES IF THEY DO NOT EXIST
-- ==============================================================================

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_policy_id() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT,
    admin_name TEXT,
    admin_email TEXT,
    admin_password TEXT,
    has_data BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    shift TEXT,
    shift_time TEXT,
    grade TEXT,
    section TEXT,
    teacher_id TEXT,
    class_teacher TEXT,
    total_students INT DEFAULT 15,
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Teachers Table
CREATE TABLE IF NOT EXISTS public.teachers (
    id TEXT PRIMARY KEY,
    teacher_id TEXT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    dob TEXT,
    gender TEXT,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'teacher',
    avatar TEXT DEFAULT '👨‍🏫',
    assigned_classes JSONB DEFAULT '[]'::jsonb,
    class_teacher_class_id TEXT,
    school_code TEXT DEFAULT 'SCH1',
    organization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Teachers Login Table
CREATE TABLE IF NOT EXISTS public.teachers_login (
    id TEXT PRIMARY KEY,
    teacher_id TEXT,
    full_name TEXT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Principals Login Table
CREATE TABLE IF NOT EXISTS public.principals_login (
    id TEXT PRIMARY KEY,
    principal_id TEXT,
    full_name TEXT,
    email TEXT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    school_name TEXT,
    phone TEXT,
    status TEXT DEFAULT 'ACTIVE',
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Principals Table
CREATE TABLE IF NOT EXISTS public.principals (
    id TEXT PRIMARY KEY,
    principal_id TEXT,
    name TEXT NOT NULL,
    email TEXT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    school_code TEXT DEFAULT 'SCH1',
    organization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    username TEXT,
    passcode TEXT,
    is_first_login BOOLEAN DEFAULT true,
    roll_no INT NOT NULL,
    name TEXT NOT NULL,
    gender TEXT,
    dob TEXT,
    photo TEXT,
    parent_name TEXT,
    parent_phone TEXT,
    class_id TEXT NOT NULL,
    school_code TEXT DEFAULT 'SCH1',
    attendance_pct INT DEFAULT 95,
    days_present NUMERIC DEFAULT 24,
    days_absent NUMERIC DEFAULT 0.5,
    days_leave NUMERIC DEFAULT 0.5,
    documents JSONB DEFAULT '{}'::jsonb,
    fee_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Students Login Table
CREATE TABLE IF NOT EXISTS public.students_login (
    id TEXT PRIMARY KEY,
    student_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    school_code TEXT DEFAULT 'SCH1',
    is_first_login BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Attendance Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    date TEXT NOT NULL,
    timestamp TEXT,
    teacher_name TEXT,
    status TEXT DEFAULT 'PENDING_APPROVAL',
    records JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '{}'::jsonb,
    decline_reason TEXT,
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    date TEXT NOT NULL,
    teacher_name TEXT,
    status TEXT DEFAULT 'PENDING_APPROVAL',
    stats JSONB DEFAULT '{}'::jsonb,
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Teacher Leave Requests Table
CREATE TABLE IF NOT EXISTS public.teacher_leave_requests (
    id TEXT PRIMARY KEY,
    teacher_id TEXT,
    teacher_name TEXT NOT NULL,
    leave_date TEXT NOT NULL,
    section_to_cover TEXT,
    reason TEXT,
    substitute_teacher_id TEXT,
    substitute_teacher_name TEXT,
    status TEXT DEFAULT 'PENDING',
    decline_reason TEXT,
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Student Leave Applications Table
CREATE TABLE IF NOT EXISTS public.student_leave_applications (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    roll_no INT NOT NULL,
    student_name TEXT NOT NULL,
    leave_date TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'PENDING_APPROVAL',
    decline_reason TEXT,
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Student Marks Table
CREATE TABLE IF NOT EXISTS public.student_marks (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    roll_no INT NOT NULL,
    student_name TEXT NOT NULL,
    subject_marks JSONB DEFAULT '{}'::jsonb,
    total_marks INT DEFAULT 0,
    percentage INT DEFAULT 0,
    grade TEXT DEFAULT 'A',
    status TEXT DEFAULT 'PASSED',
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Student Fees Table
CREATE TABLE IF NOT EXISTS public.student_fees (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    roll_no INT NOT NULL,
    total_fee NUMERIC DEFAULT 45000,
    discount_amount NUMERIC DEFAULT 5000,
    net_fee NUMERIC DEFAULT 40000,
    paid_amount NUMERIC DEFAULT 0,
    due_amount NUMERIC DEFAULT 40000,
    status TEXT DEFAULT 'NOT_PAID',
    due_date TEXT DEFAULT '15 Aug 2026',
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. WhatsApp Logs Table
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id TEXT PRIMARY KEY,
    class_name TEXT,
    parent_phone TEXT,
    student_name TEXT,
    status TEXT DEFAULT 'Sent to WhatsApp',
    timestamp TEXT,
    preview_message TEXT,
    school_code TEXT DEFAULT 'SCH1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
