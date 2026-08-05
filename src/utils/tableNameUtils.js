import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Sanitizes Organization Name to lowercase for 100% PostgreSQL compatibility (e.g. "Test New Org" -> "testneworg")
export function sanitizeOrgName(name) {
  if (!name) return 'schoolzzorg';
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').trim().toLowerCase();
  return clean || 'schoolzzorg';
}

// Generates dynamic database table names based on Organization Name (all lowercase)
export function getOrgTableNames(orgName) {
  const base = sanitizeOrgName(orgName);
  return {
    orgTable: base,
    principalTable: `${base}_principal`,
    teachersTable: `${base}_teachers`,
    studentsTable: `${base}_students`
  };
}

// Ensures database tables exist in Supabase via RPC call
export async function ensureOrgTablesExist(orgName) {
  if (!isSupabaseConfigured || !supabase) return;
  const tableNames = getOrgTableNames(orgName);
  try {
    const { error } = await supabase.rpc('create_organization_tables', { org_name: tableNames.orgTable });
    if (error) {
      console.warn(`Supabase RPC create_organization_tables error for ${tableNames.orgTable}:`, error);
    }
  } catch (e) {
    console.warn('Supabase RPC create_organization_tables notice:', e);
  }
}
