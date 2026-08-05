-- ==============================================================================
-- SUPABASE SQL SETUP FOR DYNAMIC ORGANIZATION TABLE CREATION
-- Run this script once in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

CREATE OR REPLACE FUNCTION create_organization_tables(org_name text)
RETURNS void AS $$
DECLARE
  clean_org text;
BEGIN
  -- Normalize org_name to lowercase
  clean_org := lower(org_name);

  -- 1. Create Organization Table (<org_name>)
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      code text PRIMARY KEY,
      name text,
      city text,
      admin_name text,
      admin_email text,
      registered_at timestamp with time zone DEFAULT now()
    );
  ', clean_org);
  EXECUTE format('GRANT ALL ON TABLE %I TO anon, authenticated, service_role;', clean_org);
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY;', clean_org);

  -- 2. Create Principal Table (<org_name>_principal)
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      id text PRIMARY KEY,
      name text,
      username text,
      password text,
      role text,
      school_code text,
      created_at timestamp with time zone DEFAULT now()
    );
  ', clean_org || '_principal');
  EXECUTE format('GRANT ALL ON TABLE %I TO anon, authenticated, service_role;', clean_org || '_principal');
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY;', clean_org || '_principal');

  -- 3. Create Teachers Table (<org_name>_teachers)
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      id text PRIMARY KEY,
      username text,
      password text,
      name text,
      role text,
      avatar text,
      assigned_classes jsonb,
      school_code text,
      created_at timestamp with time zone DEFAULT now()
    );
  ', clean_org || '_teachers');
  EXECUTE format('GRANT ALL ON TABLE %I TO anon, authenticated, service_role;', clean_org || '_teachers');
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY;', clean_org || '_teachers');

  -- 4. Create Students Table (<org_name>_students)
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      id text PRIMARY KEY,
      class_id text,
      roll_no integer,
      name text,
      gender text,
      photo text,
      parent_phone text,
      attendance_pct numeric,
      days_present numeric,
      days_absent numeric,
      days_leave numeric,
      school_code text,
      created_at timestamp with time zone DEFAULT now()
    );
  ', clean_org || '_students');
  EXECUTE format('GRANT ALL ON TABLE %I TO anon, authenticated, service_role;', clean_org || '_students');
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY;', clean_org || '_students');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
