import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Sanitizes Organization Name (e.g. "Hyderabad High School" -> "HyderabadHighSchool")
export function sanitizeOrgName(name) {
  if (!name) return 'SchoolzzOrg';
  const clean = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'SchoolzzOrg';
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

// Generates dynamic database table names based on Organization Name
export function getOrgTableNames(orgName) {
  const base = sanitizeOrgName(orgName);
  return {
    orgTable: base,
    principalTable: `${base}_Principal`,
    teachersTable: `${base}_Teachers`,
    studentsTable: `${base}_Students`
  };
}

// Ensures database tables exist in Supabase via RPC call
export async function ensureOrgTablesExist(orgName) {
  if (!isSupabaseConfigured || !supabase) return;
  const tableNames = getOrgTableNames(orgName);
  try {
    await supabase.rpc('create_organization_tables', { org_name: tableNames.orgTable });
  } catch (e) {
    console.warn('Supabase RPC create_organization_tables notice:', e);
  }
}
