-- ==============================================================================
-- SUPABASE SQL SETUP FOR DYNAMIC ORGANIZATION TABLE CREATION
-- Run this script once in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

CREATE OR REPLACE FUNCTION create_organization_tables(org_name text)
RETURNS void AS $$
BEGIN
  -- 1. Create Organization Table (<OrgName>)
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      code text PRIMARY KEY,
      name text,
      city text,
      admin_name text,
      admin_email text,
      registered_at timestamp with time zone DEFAULT now()
    );
  ', org_name);
  EXECUTE format('GRANT ALL ON TABLE %I TO anon, authenticated, service_role;', org_name);
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY;', org_name);

  -- 2. Create Principal Table (<OrgName>_Principal)
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
  ', org_name || '_Principal');
  EXECUTE format('GRANT ALL ON TABLE %I TO anon, authenticated, service_role;', org_name || '_Principal');
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY;', org_name || '_Principal');

  -- 3. Create Teachers Table (<OrgName>_Teachers)
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
  ', org_name || '_Teachers');
  EXECUTE format('GRANT ALL ON TABLE %I TO anon, authenticated, service_role;', org_name || '_Teachers');
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY;', org_name || '_Teachers');

  -- 4. Create Students Table (<OrgName>_Students)
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
  ', org_name || '_Students');
  EXECUTE format('GRANT ALL ON TABLE %I TO anon, authenticated, service_role;', org_name || '_Students');
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY;', org_name || '_Students');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
