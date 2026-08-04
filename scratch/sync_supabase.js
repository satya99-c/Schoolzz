import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env manually
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseAnonKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.replace('VITE_SUPABASE_URL=', '').trim();
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.replace('VITE_SUPABASE_ANON_KEY=', '').trim();
  }
});

console.log('Connecting to Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const INITIAL_CLASSES = [
  { id: "10-A_morning", name: "Class 10 - Section A", shift: "Morning Section", shiftTime: "08:00 AM - 12:00 PM", classTeacher: "Mr. Sharma (Teacher 1)", totalStudents: 15 },
  { id: "10-B_afternoon", name: "Class 10 - Section B", shift: "Afternoon Section", shiftTime: "12:30 PM - 04:30 PM", classTeacher: "Mr. Sharma (Teacher 1)", totalStudents: 15 },
  { id: "9-A_morning", name: "Class 9 - Section A", shift: "Morning Section", shiftTime: "08:00 AM - 12:00 PM", classTeacher: "Mrs. Kapoor (Teacher 2)", totalStudents: 15 },
  { id: "10-A_afternoon", name: "Class 10 - Section A", shift: "Afternoon Section", shiftTime: "12:30 PM - 04:30 PM", classTeacher: "Mrs. Kapoor (Teacher 2)", totalStudents: 15 },
  { id: "10-B_morning", name: "Class 10 - Section B", shift: "Morning Section", shiftTime: "08:00 AM - 12:00 PM", classTeacher: "Ms. Ananya (Teacher 3)", totalStudents: 15 },
  { id: "9-A_afternoon", name: "Class 9 - Section A", shift: "Afternoon Section", shiftTime: "12:30 PM - 04:30 PM", classTeacher: "Ms. Ananya (Teacher 3)", totalStudents: 15 }
];

const TEACHERS = [
  { id: "user-teacher-1", username: "teacher1", password: "teacher1", name: "Mr. Sharma (Teacher 1)", role: "teacher", avatar: "👨‍🏫", assignedClasses: ["10-A_morning", "10-B_afternoon"] },
  { id: "user-teacher-2", username: "teacher2", password: "teacher2", name: "Mrs. Kapoor (Teacher 2)", role: "teacher", avatar: "👩‍🏫", assignedClasses: ["9-A_morning", "10-A_afternoon"] },
  { id: "user-teacher-3", username: "teacher3", password: "teacher3", name: "Ms. Ananya (Teacher 3)", role: "teacher", avatar: "👩‍🏫", assignedClasses: ["10-B_morning", "9-A_afternoon"] }
];

async function syncToSupabase() {
  console.log('🚀 Syncing initial data directly to Supabase...');

  // 1. Sync Classes
  console.log('📦 Syncing Classes...');
  const classRows = INITIAL_CLASSES.map(c => ({
    id: c.id,
    name: c.name,
    shift: c.shift,
    shift_time: c.shiftTime,
    class_teacher: c.classTeacher,
    total_students: c.totalStudents
  }));

  const { error: clsErr } = await supabase.from('classes').upsert(classRows);
  if (clsErr) console.error('Error syncing classes:', clsErr.message);
  else console.log('✅ Classes synced successfully!');

  // 2. Sync Teachers
  console.log('👨‍🏫 Syncing Teachers...');
  const teacherRows = TEACHERS.map(t => ({
    id: t.id,
    username: t.username,
    password: t.password,
    name: t.name,
    role: 'teacher',
    avatar: t.avatar || '👨‍🏫',
    assigned_classes: t.assignedClasses || []
  }));

  const { error: tErr } = await supabase.from('teachers').upsert(teacherRows);
  if (tErr) console.error('Error syncing teachers:', tErr.message);
  else console.log('✅ Teachers synced successfully!');

  console.log('🎉 Supabase sync execution finished!');
}

syncToSupabase();
