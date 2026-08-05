import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function sanitizeOrgName(name) {
  if (!name) return 'schoolzzorg';
  return name.replace(/[^a-zA-Z0-9]/g, '').trim().toLowerCase() || 'schoolzzorg';
}

export function getOrgTableNames(orgName) {
  return {
    orgTable: 'organizations',
    principalTable: 'principals',
    teachersTable: 'teachers',
    studentsTable: 'students'
  };
}

export async function ensureOrgTablesExist(orgName) {
  // Unified single-table multi-tenant model.
  return;
}
