import fs from 'fs';
import path from 'path';

// Import initial dataset from mockData
import { INITIAL_CLASSES, INITIAL_STUDENTS, MOCK_USERS } from './src/data/mockData.js';

const exportDir = path.join(process.cwd(), 'exported_csvs');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// 1. Export teachers.csv
const teachersHeaders = ['id', 'teacher_id', 'username', 'password', 'name', 'first_name', 'last_name', 'dob', 'gender', 'phone', 'email', 'role', 'avatar', 'school_code'];
const teachersRows = [teachersHeaders.join(',')];

MOCK_USERS.filter(u => u.role === 'teacher').forEach(t => {
  const parts = t.name.split(' ');
  const fName = parts[0] || '';
  const lName = parts.slice(1).join(' ') || '';
  const row = [
    escapeCSV(t.id),
    escapeCSV(t.teacherId || t.id),
    escapeCSV(t.username),
    escapeCSV(t.password),
    escapeCSV(t.name),
    escapeCSV(t.firstName || fName),
    escapeCSV(t.lastName || lName),
    escapeCSV(t.dob || '1990-01-01'),
    escapeCSV(t.gender || 'Male'),
    escapeCSV(t.phone || '+91 98765 43210'),
    escapeCSV(t.email || `${t.username.toLowerCase()}@schoolzz.edu`),
    escapeCSV(t.role || 'teacher'),
    escapeCSV(t.avatar || '👨‍🏫'),
    escapeCSV('SCH1')
  ];
  teachersRows.push(row.join(','));
});

fs.writeFileSync(path.join(exportDir, 'teachers.csv'), teachersRows.join('\n'));

// 2. Export classes.csv
const classesHeaders = ['id', 'name', 'shift', 'shift_time', 'grade', 'section', 'teacher_id', 'class_teacher', 'total_students', 'school_code'];
const classesRows = [classesHeaders.join(',')];

INITIAL_CLASSES.forEach(c => {
  const row = [
    escapeCSV(c.id),
    escapeCSV(c.name),
    escapeCSV(c.shift),
    escapeCSV(c.shiftTime),
    escapeCSV(c.grade),
    escapeCSV(c.section),
    escapeCSV(c.teacherId),
    escapeCSV(c.classTeacher),
    escapeCSV(c.totalStudents),
    escapeCSV('SCH1')
  ];
  classesRows.push(row.join(','));
});

fs.writeFileSync(path.join(exportDir, 'classes.csv'), classesRows.join('\n'));

// 3. Export students.csv
const studentsHeaders = ['id', 'student_id', 'class_id', 'roll_no', 'name', 'gender', 'dob', 'parent_name', 'parent_phone', 'attendance_pct', 'days_present', 'days_absent', 'days_leave', 'school_code'];
const studentsRows = [studentsHeaders.join(',')];

Object.entries(INITIAL_STUDENTS).forEach(([classId, studentList]) => {
  studentList.forEach(s => {
    const sId = `S${String(s.rollNo).padStart(3, '0')}`;
    const row = [
      escapeCSV(`${classId}_${s.rollNo}`),
      escapeCSV(sId),
      escapeCSV(classId),
      escapeCSV(s.rollNo),
      escapeCSV(s.name),
      escapeCSV(s.gender || 'Male'),
      escapeCSV('2010-05-15'),
      escapeCSV(`Parent of ${s.name}`),
      escapeCSV(s.parentPhone),
      escapeCSV(s.attendancePct),
      escapeCSV(s.daysPresent),
      escapeCSV(s.daysAbsent),
      escapeCSV(s.daysLeave),
      escapeCSV('SCH1')
    ];
    studentsRows.push(row.join(','));
  });
});

fs.writeFileSync(path.join(exportDir, 'students.csv'), studentsRows.join('\n'));

// 4. Export principals.csv
const principalsHeaders = ['id', 'principal_id', 'name', 'email', 'username', 'password', 'school_code', 'organization'];
const principalsRows = [principalsHeaders.join(',')];

MOCK_USERS.filter(u => u.role === 'principal').forEach(p => {
  const row = [
    escapeCSV(p.id),
    escapeCSV(p.id),
    escapeCSV(p.name),
    escapeCSV(p.email || 'principal@schoolzz.edu'),
    escapeCSV(p.username),
    escapeCSV(p.password),
    escapeCSV('SCH1'),
    escapeCSV('Sunshine International School')
  ];
  principalsRows.push(row.join(','));
});

fs.writeFileSync(path.join(exportDir, 'principals.csv'), principalsRows.join('\n'));

// 5. Export student_fees.csv
const feesHeaders = ['id', 'class_id', 'roll_no', 'total_fee', 'discount_amount', 'net_fee', 'paid_amount', 'due_amount', 'status', 'due_date', 'school_code'];
const feesRows = [feesHeaders.join(',')];

Object.entries(INITIAL_STUDENTS).forEach(([classId, studentList]) => {
  studentList.forEach(s => {
    const row = [
      escapeCSV(`fee_${classId}_${s.rollNo}`),
      escapeCSV(classId),
      escapeCSV(s.rollNo),
      escapeCSV(45000),
      escapeCSV(5000),
      escapeCSV(40000),
      escapeCSV(0),
      escapeCSV(40000),
      escapeCSV('NOT_PAID'),
      escapeCSV('15 Aug 2026'),
      escapeCSV('SCH1')
    ];
    feesRows.push(row.join(','));
  });
});

fs.writeFileSync(path.join(exportDir, 'student_fees.csv'), feesRows.join('\n'));

console.log('✅ CSV exports created successfully in exported_csvs/ directory!');
