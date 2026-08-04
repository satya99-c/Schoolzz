import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env file directly
let envUrl = '';
let envKey = '';

try {
  const envContent = fs.readFileSync('./.env', 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      envUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      envKey = line.split('=')[1].trim();
    }
  });
} catch (e) {
  console.error("Could not read .env file");
}

if (!envUrl || !envKey) {
  console.error("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(envUrl, envKey);

async function pushLoginTables() {
  console.log("🚀 Pushing Login Tables data to Supabase at:", envUrl);

  const PRINCIPAL_LOGINS = [
    {
      principal_id: "PRIN-001",
      full_name: "Dr. Rajesh Sharma",
      email: "principal@schoolzz.edu",
      username: "principal",
      password_hash: "principal123",
      school_name: "Delhi Public School",
      phone: "+91 98765 43210",
      status: "ACTIVE"
    }
  ];

  const TEACHER_LOGINS = [
    {
      teacher_id: "TCH-001",
      full_name: "Mr. Sharma (Teacher 1)",
      email: "sharma@schoolzz.edu",
      username: "teacher1",
      password_hash: "teacher123",
      assigned_classes: ["10-A_morning", "10-B_afternoon"],
      department: "Mathematics",
      phone: "+91 98123 45678",
      status: "ACTIVE"
    },
    {
      teacher_id: "TCH-002",
      full_name: "Mrs. Kapoor (Teacher 2)",
      email: "kapoor@schoolzz.edu",
      username: "teacher2",
      password_hash: "teacher123",
      assigned_classes: ["9-A_morning", "10-A_afternoon"],
      department: "Science",
      phone: "+91 98123 45679",
      status: "ACTIVE"
    }
  ];

  const STUDENT_LOGINS = [
    {
      student_id: "STU-10A-01",
      roll_no: 1,
      full_name: "Isha Kapoor",
      class_id: "10-A_morning",
      username: "isha.kapoor",
      passcode: "1001",
      parent_phone: "+91 97222 22201",
      gender: "Female",
      status: "ACTIVE"
    },
    {
      student_id: "STU-10A-02",
      roll_no: 2,
      full_name: "Kabir Das",
      class_id: "10-A_morning",
      username: "kabir.das",
      passcode: "1002",
      parent_phone: "+91 97222 22202",
      gender: "Male",
      status: "ACTIVE"
    },
    {
      student_id: "STU-10A-03",
      roll_no: 3,
      full_name: "Aanya Sen",
      class_id: "10-A_morning",
      username: "aanya.sen",
      passcode: "1003",
      parent_phone: "+91 97222 22203",
      gender: "Female",
      status: "ACTIVE"
    },
    {
      student_id: "STU-10A-04",
      roll_no: 4,
      full_name: "Vihaan Mehta",
      class_id: "10-A_morning",
      username: "vihaan.mehta",
      passcode: "1004",
      parent_phone: "+91 97222 22204",
      gender: "Male",
      status: "ACTIVE"
    },
    {
      student_id: "STU-10A-05",
      roll_no: 5,
      full_name: "Ananya Roy",
      class_id: "10-A_morning",
      username: "ananya.roy",
      passcode: "1005",
      parent_phone: "+91 97222 22205",
      gender: "Female",
      status: "ACTIVE"
    }
  ];

  // 1. Push Principals
  const { data: pData, error: pErr } = await supabase.from('principals_login').upsert(PRINCIPAL_LOGINS, { onConflict: 'principal_id' });
  if (pErr) {
    console.log("⚠️ principals_login table push result:", pErr.message);
  } else {
    console.log("✅ principals_login pushed successfully!");
  }

  // 2. Push Teachers
  const { data: tData, error: tErr } = await supabase.from('teachers_login').upsert(TEACHER_LOGINS, { onConflict: 'teacher_id' });
  if (tErr) {
    console.log("⚠️ teachers_login table push result:", tErr.message);
  } else {
    console.log("✅ teachers_login pushed successfully!");
  }

  // 3. Push Students
  const { data: sData, error: sErr } = await supabase.from('students_login').upsert(STUDENT_LOGINS, { onConflict: 'student_id' });
  if (sErr) {
    console.log("⚠️ students_login table push result:", sErr.message);
  } else {
    console.log("✅ students_login pushed successfully!");
  }
}

pushLoginTables();
