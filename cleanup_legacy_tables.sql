-- ==============================================================================
-- SQL CLEANUP SCRIPT: DROP LEGACY DYNAMIC ORGANIZATION TABLES
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- Drop TestnewOrg tables
DROP TABLE IF EXISTS "TestnewOrg_Principal" CASCADE;
DROP TABLE IF EXISTS "TestnewOrg_Teachers" CASCADE;
DROP TABLE IF EXISTS "TestnewOrg_Students" CASCADE;
DROP TABLE IF EXISTS "TestnewOrg" CASCADE;

-- Drop adityaschool tables
DROP TABLE IF EXISTS "adityaschool" CASCADE;
DROP TABLE IF EXISTS "adityaschool_Principal" CASCADE;
DROP TABLE IF EXISTS "adityaschool_Students" CASCADE;
DROP TABLE IF EXISTS "adityaschool_Teachers" CASCADE;

-- Drop lowercase variants if created
DROP TABLE IF EXISTS "testneworg" CASCADE;
DROP TABLE IF EXISTS "testneworg_principal" CASCADE;
DROP TABLE IF EXISTS "testneworg_teachers" CASCADE;
DROP TABLE IF EXISTS "testneworg_students" CASCADE;

-- Drop legacy RPC function
DROP FUNCTION IF EXISTS create_organization_tables(text);
