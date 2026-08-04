import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_CLASSES, INITIAL_STUDENTS, MOCK_USERS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  // Teachers state
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('schoolzz_teachers');
    if (saved) return JSON.parse(saved);
    return MOCK_USERS.filter(u => u.role === 'teacher');
  });

  // Classes state
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('schoolzz_classes');
    if (saved) return JSON.parse(saved);
    return INITIAL_CLASSES;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('schoolzz_user');
    return saved ? JSON.parse(saved) : MOCK_USERS[0];
  });

  const [activeClassId, setActiveClassId] = useState('10-A');

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('schoolzz_students');
    if (!saved) return INITIAL_STUDENTS;
    const parsed = JSON.parse(saved);
    if (!parsed['10-A_morning'] || parsed['10-A_morning'].length < 15) {
      return INITIAL_STUDENTS;
    }
    return parsed;
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('schoolzz_submissions');
    return saved ? JSON.parse(saved) : {};
  });

  const [dbReports, setDbReports] = useState(() => {
    const saved = localStorage.getItem('schoolzz_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [whatsappLogs, setWhatsappLogs] = useState(() => {
    const saved = localStorage.getItem('schoolzz_whatsapp');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-demo-1',
        studentName: 'Rahul Verma',
        rollNo: 12,
        classId: '10-B',
        parentPhone: '+91 98765 00001',
        message: 'Dear Parent, Roll #12 Rahul Verma was ABSENT today at school without prior planned leave. Please acknowledge.',
        timestamp: '09:15 AM - Yesterday',
        status: 'Delivered',
        acknowledged: true
      }
    ];
  });

  // Attendance Reminders state (Morning 8:10, 8:30, 9:00 AM | Afternoon 12:40, 1:00, 1:30 PM)
  const [attendanceReminders, setAttendanceReminders] = useState(() => {
    const saved = localStorage.getItem('schoolzz_reminders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'rem-m1',
        session: 'Morning Session',
        classId: 'Class 10 - Section A',
        teacherName: 'Mrs. Sharma',
        reminderLevel: 'Reminder 1 (8:10 AM)',
        timeScheduled: '08:10 AM',
        message: '🔔 Gentle Reminder: Morning Session attendance for Class 10-A has not been marked yet.',
        status: 'SENT',
        timestamp: '08:10 AM Today'
      },
      {
        id: 'rem-m2',
        session: 'Morning Session',
        classId: 'Class 10 - Section A',
        teacherName: 'Mrs. Sharma',
        reminderLevel: 'Reminder 2 (8:30 AM)',
        timeScheduled: '08:30 AM',
        message: '⚠️ Second Reminder: Morning Session attendance for Class 10-A is overdue by 30 minutes!',
        status: 'SENT',
        timestamp: '08:30 AM Today'
      },
      {
        id: 'rem-a1',
        session: 'Afternoon Session',
        classId: 'Class 10 - Section A',
        teacherName: 'Mrs. Kapoor',
        reminderLevel: 'Reminder 1 (12:40 PM)',
        timeScheduled: '12:40 PM',
        message: '🔔 Gentle Reminder: Afternoon Session attendance for Class 10-A has not been marked yet.',
        status: 'SCHEDULED',
        timestamp: '12:40 PM Today'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('schoolzz_reminders', JSON.stringify(attendanceReminders));
  }, [attendanceReminders]);

  // Student Exam Marks & Scorecards State
  const [studentMarks, setStudentMarks] = useState(() => {
    const saved = localStorage.getItem('schoolzz_marks');
    return saved ? JSON.parse(saved) : {
      '10-A_morning': [
        {
          rollNo: 1,
          studentName: 'Isha Kapoor',
          examName: 'Mid-Term Examination 2026',
          subjects: {
            Mathematics: 95,
            Science: 92,
            English: 88,
            SocialStudies: 90,
            Physics: 98
          },
          totalMarks: 463,
          maxMarks: 500,
          percentage: 92.6,
          grade: 'A+',
          status: 'PASSED',
          remarks: 'Outstanding academic performance! Excellent problem-solving skills.',
          submittedAt: 'Today, 11:30 AM'
        },
        {
          rollNo: 2,
          studentName: 'Kabir Das',
          examName: 'Mid-Term Examination 2026',
          subjects: {
            Mathematics: 82,
            Science: 78,
            English: 85,
            SocialStudies: 80,
            Physics: 88
          },
          totalMarks: 413,
          maxMarks: 500,
          percentage: 82.6,
          grade: 'A',
          status: 'PASSED',
          remarks: 'Good academic progress. Keep up the dedication.',
          submittedAt: 'Today, 11:35 AM'
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('schoolzz_marks', JSON.stringify(studentMarks));
  }, [studentMarks]);

  // Exam Rosters State
  const [examRosters, setExamRosters] = useState(() => {
    const saved = localStorage.getItem('schoolzz_exam_rosters');
    return saved ? JSON.parse(saved) : [
      {
        id: 'roster-1',
        classId: '10-A_morning',
        examName: 'Mid-Term Examination 2026',
        createdAt: 'Today'
      },
      {
        id: 'roster-2',
        classId: '10-A_morning',
        examName: 'Unit Test 1 - 2026',
        createdAt: 'Yesterday'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('schoolzz_exam_rosters', JSON.stringify(examRosters));
  }, [examRosters]);

  const createExamRoster = (classId, examName) => {
    const trimmed = examName.trim();
    const existing = examRosters.find(r => r.classId === classId && r.examName.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      showToast(`Exam Roster "${trimmed}" already exists for this class!`, 'info');
      return existing;
    }

    const newRoster = {
      id: `roster-${Date.now()}`,
      classId,
      examName: trimmed,
      createdAt: 'Today'
    };

    setExamRosters(prev => [newRoster, ...prev]);
    showToast(`Exam Roster "${trimmed}" created successfully!`, 'success');
    return newRoster;
  };

  const saveStudentMarks = ({ classId, rollNo, studentName, examName, subjects, remarks }) => {
    const math = Number(subjects.Mathematics || 0);
    const sci = Number(subjects.Science || 0);
    const eng = Number(subjects.English || 0);
    const ss = Number(subjects.SocialStudies || 0);
    const phy = Number(subjects.Physics ?? subjects.ComputerScience ?? 0);

    const total = math + sci + eng + ss + phy;
    const maxMarks = 500;
    const pct = Math.round((total / maxMarks) * 1000) / 10;

    // Grade is based strictly on total percentage got
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B';
    else if (pct >= 60) grade = 'C';
    else if (pct >= 33) grade = 'D';

    // Pass Criteria: If ANY subject is < 35, student is FAILED!
    const hasFailedSubject = math < 35 || sci < 35 || eng < 35 || ss < 35 || phy < 35;
    const status = hasFailedSubject ? 'FAILED' : 'PASSED';

    const newRecord = {
      rollNo,
      studentName,
      examName: examName || 'Mid-Term Examination 2026',
      subjects: {
        Mathematics: math,
        Science: sci,
        English: eng,
        SocialStudies: ss,
        Physics: phy
      },
      totalMarks: total,
      maxMarks,
      percentage: pct,
      grade,
      status,
      remarks: remarks || 'Good effort! Keep learning.',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today'
    };

    setStudentMarks(prev => {
      const classRecords = prev[classId] || [];
      const filtered = classRecords.filter(r => r.rollNo !== rollNo || r.examName !== newRecord.examName);
      return {
        ...prev,
        [classId]: [newRecord, ...filtered]
      };
    });

    showToast(`Exam marks submitted successfully for ${studentName}!`, 'success');
  };

  const triggerManualReminder = (classId, session, level) => {
    const newReminder = {
      id: `rem-${Date.now()}`,
      session,
      classId,
      reminderLevel: level,
      message: `🔔 Automated Alert: Attendance not submitted for ${classId} (${session}). ${level} alert issued!`,
      status: 'SENT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAttendanceReminders(prev => [newReminder, ...prev]);
    showToast(`Reminder alert (${level}) sent for ${classId}!`, 'info');
  };

  const [toast, setToast] = useState(null);
  const [activeWhatsAppPreview, setActiveWhatsAppPreview] = useState(null);
  const [approvalModalData, setApprovalModalData] = useState(null);
  const [isMigrating, setIsMigrating] = useState(false);

  // Show Toast notification
  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // AUTO-MIGRATE / SEED SUPABASE DATABASE TABLES IF EMPTY
  const autoMigrateSupabase = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase || isMigrating) return;
    setIsMigrating(true);

    try {
      // 1. Auto-migrate Classes
      const { data: dbClasses, error: clsErr } = await supabase.from('classes').select('id');
      if (!clsErr && (!dbClasses || dbClasses.length === 0)) {
        console.log('⚡ Auto-Migrating INITIAL_CLASSES to Supabase...');
        const classRows = INITIAL_CLASSES.map(c => ({
          id: c.id,
          name: c.name,
          shift: c.shift,
          shift_time: c.shiftTime,
          class_teacher: c.classTeacher,
          total_students: c.totalStudents
        }));
        await supabase.from('classes').upsert(classRows);
      }

      // 2. Auto-migrate Teachers
      const { data: dbTeachers, error: tErr } = await supabase.from('teachers').select('id');
      if (!tErr && (!dbTeachers || dbTeachers.length === 0)) {
        console.log('⚡ Auto-Migrating Teachers to Supabase...');
        const initialTeachers = MOCK_USERS.filter(u => u.role === 'teacher');
        const teacherRows = initialTeachers.map(t => ({
          id: t.id,
          username: t.username,
          password: t.password,
          name: t.name,
          role: 'teacher',
          avatar: t.avatar || '👨‍🏫',
          assigned_classes: t.assignedClasses || []
        }));
        await supabase.from('teachers').upsert(teacherRows);
      }

      // 3. Auto-migrate Students
      const { data: dbStudents, error: stErr } = await supabase.from('students').select('id');
      if (!stErr && (!dbStudents || dbStudents.length === 0)) {
        console.log('⚡ Auto-Migrating 90 Students to Supabase...');
        const allStudentRows = [];
        Object.entries(INITIAL_STUDENTS).forEach(([classId, stList]) => {
          stList.forEach(s => {
            allStudentRows.push({
              class_id: classId,
              roll_no: s.rollNo,
              name: s.name,
              gender: s.gender,
              photo: s.photo,
              parent_phone: s.parentPhone,
              attendance_pct: s.attendancePct,
              days_present: s.daysPresent,
              days_absent: s.daysAbsent,
              days_leave: s.daysLeave
            });
          });
        });
        await supabase.from('students').upsert(allStudentRows);
      }

      // 4. Auto-migrate Principals Login Table
      const { data: dbPrinLogin, error: prinLogErr } = await supabase.from('principals_login').select('id');
      if (!prinLogErr && (!dbPrinLogin || dbPrinLogin.length === 0)) {
        console.log('⚡ Auto-Migrating principals_login to Supabase...');
        await supabase.from('principals_login').upsert([{
          principal_id: "PRIN-001",
          full_name: "Dr. Rajesh Sharma",
          email: "principal@schoolzz.edu",
          username: "principal",
          password_hash: "principal123",
          school_name: "Delhi Public School",
          phone: "+91 98765 43210",
          status: "ACTIVE"
        }], { onConflict: 'principal_id' });
      }

      // 5. Auto-migrate Teachers Login Table
      const { data: dbTchLogin, error: tchLogErr } = await supabase.from('teachers_login').select('id');
      if (!tchLogErr && (!dbTchLogin || dbTchLogin.length === 0)) {
        console.log('⚡ Auto-Migrating teachers_login to Supabase...');
        await supabase.from('teachers_login').upsert([
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
        ], { onConflict: 'teacher_id' });
      }

      // 6. Auto-migrate Students Login Table
      const { data: dbStuLogin, error: stuLogErr } = await supabase.from('students_login').select('id');
      if (!stuLogErr && (!dbStuLogin || dbStuLogin.length === 0)) {
        console.log('⚡ Auto-Migrating students_login to Supabase...');
        await supabase.from('students_login').upsert([
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
          }
        ], { onConflict: 'student_id' });
      }

    } catch (err) {
      console.warn('Auto migration warning:', err);
    } finally {
      setIsMigrating(false);
    }
  }, [isMigrating]);

  // FETCH REAL SUPABASE DATA
  const fetchSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      // 1. Fetch Teachers
      const { data: tData, error: tErr } = await supabase.from('teachers').select('*');
      if (!tErr && tData && tData.length > 0) {
        const mappedTeachers = tData.map(t => ({
          id: t.id,
          username: t.username,
          password: t.password,
          name: t.name,
          role: t.role || 'teacher',
          avatar: t.avatar || '👨‍🏫',
          assignedClasses: t.assigned_classes || []
        }));
        setTeachers(mappedTeachers);
      }

      // 2. Fetch Classes
      const { data: clsData, error: clsErr } = await supabase.from('classes').select('*');
      if (!clsErr && clsData && clsData.length > 0) {
        const mappedClasses = clsData.map(c => ({
          id: c.id,
          name: c.name,
          shift: c.shift,
          shiftTime: c.shift_time,
          classTeacher: c.class_teacher,
          totalStudents: c.total_students || 15
        }));
        setClasses(mappedClasses);
      }

      // 3. Fetch Students
      const { data: stData, error: stErr } = await supabase.from('students').select('*');
      if (!stErr && stData && stData.length > 0) {
        const stMap = {};
        stData.forEach(s => {
          if (!stMap[s.class_id]) stMap[s.class_id] = [];
          stMap[s.class_id].push({
            rollNo: s.roll_no,
            name: s.name,
            gender: s.gender,
            photo: s.photo,
            parentPhone: s.parent_phone,
            attendancePct: s.attendance_pct || 90,
            daysPresent: s.days_present || 23,
            daysAbsent: s.days_absent || 1.5,
            daysLeave: s.days_leave || 0.5,
            prePlannedLeave: s.pre_planned_leave || false,
            leaveReason: s.leave_reason
          });
        });

        setStudents(prev => ({
          ...prev,
          ...stMap
        }));
      }

      // 4. Fetch Submissions
      const { data: subData, error: subErr } = await supabase.from('submissions').select('*');
      if (!subErr && subData) {
        const subMap = {};
        subData.forEach(row => {
          subMap[row.id] = {
            id: row.id,
            classId: row.class_id,
            date: row.submission_date,
            timestamp: row.timestamp,
            teacherName: row.teacher_name,
            status: row.status,
            declineReason: row.decline_reason,
            records: row.records,
            stats: row.stats
          };
        });
        setSubmissions(subMap);
      }

      // 5. Fetch Daily Reports
      const { data: repData, error: repErr } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (!repErr && repData) {
        setDbReports(repData);
      }

      // 6. Fetch WhatsApp Logs
      const { data: waData, error: waErr } = await supabase.from('whatsapp_logs').select('*').order('created_at', { ascending: false });
      if (!waErr && waData) {
        const mappedLogs = waData.map(row => ({
          id: row.id,
          studentName: row.student_name,
          rollNo: row.roll_no,
          classId: row.class_id,
          parentPhone: row.parent_phone,
          message: row.message,
          timestamp: row.timestamp,
          status: row.status,
          acknowledged: row.acknowledged
        }));
        setWhatsappLogs(mappedLogs);
      }

      // Trigger auto-migration check if tables were empty
      if (!tData || tData.length === 0 || !clsData || clsData.length === 0 || !stData || stData.length === 0) {
        await autoMigrateSupabase();
      }

    } catch (err) {
      console.warn('Supabase fetch error:', err);
    }
  }, [autoMigrateSupabase]);

  // REALTIME SUPABASE SUBSCRIBER ON MOUNT
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      fetchSupabaseData();

      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'teachers' }, () => fetchSupabaseData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, () => fetchSupabaseData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => fetchSupabaseData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => fetchSupabaseData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => fetchSupabaseData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'whatsapp_logs' }, () => fetchSupabaseData())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchSupabaseData]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('schoolzz_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('schoolzz_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('schoolzz_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('schoolzz_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('schoolzz_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('schoolzz_reports', JSON.stringify(dbReports));
  }, [dbReports]);

  useEffect(() => {
    localStorage.setItem('schoolzz_whatsapp', JSON.stringify(whatsappLogs));
  }, [whatsappLogs]);

  // ONBOARD NEW TEACHER
  const onboardTeacher = async (teacherData) => {
    const exists = teachers.some(t => t.username.toLowerCase() === teacherData.username.toLowerCase());
    if (exists) {
      return { success: false, error: `Username '${teacherData.username}' is already taken!` };
    }

    const newTeacher = {
      id: `user-teacher-${Date.now()}`,
      username: teacherData.username,
      password: teacherData.password,
      name: teacherData.name,
      role: 'teacher',
      avatar: teacherData.avatar || '👨‍🏫',
      assignedClasses: []
    };

    setTeachers(prev => [...prev, newTeacher]);
    MOCK_USERS.push(newTeacher);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('teachers').insert({
          id: newTeacher.id,
          username: newTeacher.username,
          password: newTeacher.password,
          name: newTeacher.name,
          role: 'teacher',
          avatar: newTeacher.avatar,
          assigned_classes: []
        });

        if (error) {
          console.error('Supabase Teacher Insert Error:', error);
          showToast(`Teacher onboarded locally! (Supabase notice: ${error.message})`, 'info');
        } else {
          showToast(`New Teacher '${newTeacher.name}' onboarded & synced to Supabase Database!`, 'success');
        }
      } catch (e) {
        console.warn('Supabase onboard teacher error:', e);
      }
    } else {
      showToast(`New Teacher '${newTeacher.name}' onboarded successfully!`, 'success');
    }

    return { success: true, teacher: newTeacher };
  };

  // CREATE NEW CLASS AND ASSIGN STUDENTS + TEACHER (WITH OCCUPANCY CHECK)
  const createClassAndStudents = async (classData, studentList) => {
    const targetTeacher = teachers.find(t => t.id === classData.teacherId);
    if (!targetTeacher) {
      return { success: false, error: 'Please select a valid teacher.' };
    }

    if (targetTeacher.assignedClasses && targetTeacher.assignedClasses.length >= 2) {
      return {
        success: false,
        error: `Teacher '${targetTeacher.name}' is already occupied with 2 class assignments! Please assign to another available teacher or onboard a new teacher.`
      };
    }

    const classId = `${classData.name.replace(/\s+/g, '')}_${classData.shift.split(' ')[0].toLowerCase()}`;
    const updatedAssignedClasses = [...(targetTeacher.assignedClasses || []), classId];

    const newClassObj = {
      id: classId,
      name: classData.name,
      shift: classData.shift,
      shiftTime: classData.shiftTime,
      grade: classData.grade,
      section: classData.section,
      teacherId: targetTeacher.id,
      classTeacher: targetTeacher.name,
      totalStudents: studentList.length
    };

    setClasses(prev => [...prev, newClassObj]);

    setStudents(prev => ({
      ...prev,
      [classId]: studentList
    }));

    setTeachers(prev => prev.map(t => {
      if (t.id === targetTeacher.id) {
        return {
          ...t,
          assignedClasses: updatedAssignedClasses
        };
      }
      return t;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('classes').upsert({
          id: classId,
          name: classData.name,
          shift: classData.shift,
          shift_time: classData.shiftTime,
          class_teacher: targetTeacher.name,
          total_students: studentList.length
        });

        const supabaseStudentRows = studentList.map(s => ({
          class_id: classId,
          roll_no: s.rollNo,
          name: s.name,
          gender: s.gender,
          photo: s.photo,
          parent_phone: s.parentPhone,
          attendance_pct: s.attendancePct || 90,
          days_present: s.daysPresent || 23,
          days_absent: s.daysAbsent || 1.5,
          days_leave: s.daysLeave || 0.5
        }));

        await supabase.from('students').insert(supabaseStudentRows);

        await supabase.from('teachers').update({
          assigned_classes: updatedAssignedClasses
        }).eq('id', targetTeacher.id);

        showToast(`Class '${classData.name}' with ${studentList.length} students saved to Supabase Database!`, 'success');
      } catch (e) {
        console.warn('Supabase create class error:', e);
      }
    } else {
      showToast(`Class '${classData.name}' with ${studentList.length} students created & assigned to ${targetTeacher.name}!`, 'success');
    }

    return { success: true };
  };

  // Login handler
  const login = (username, password) => {
    const allUsers = [...MOCK_USERS, ...teachers];
    const foundUser = allUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      showToast(`Welcome back, ${foundUser.name}!`, 'success');
      return { success: true, user: foundUser };
    } else {
      showToast('Invalid Username or Password!', 'error');
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // Switch role directly
  const switchRole = (role) => {
    const allUsers = [...MOCK_USERS, ...teachers];
    const targetUser = allUsers.find(u => u.role === role) || MOCK_USERS[0];
    setCurrentUser(targetUser);
    showToast(`Switched to ${role.toUpperCase()} Portal`, 'info');
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('schoolzz_user');
    showToast('Logged out successfully', 'info');
  };

  // Submit attendance from teacher (also creates a Report record in Database)
  const submitTeacherAttendance = async (classId, markedRecords) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const submissionId = `${classId}_${dateStr}`;
    const reportId = `report_${classId}_${dateStr}`;
    
    const absentCount = markedRecords.filter(r => r.status === 'absent').length;
    const presentCount = markedRecords.filter(r => r.status === 'present').length;
    const plannedLeaveCount = markedRecords.filter(r => r.status === 'absent' && r.plannedLeave).length;
    const unplannedAbsentCount = markedRecords.filter(r => r.status === 'absent' && !r.plannedLeave).length;
    const pct = Math.round((presentCount / markedRecords.length) * 100);

    const newSubmission = {
      id: submissionId,
      classId,
      date: dateStr,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      teacherName: currentUser?.name || 'Teacher',
      status: 'PENDING_APPROVAL',
      records: markedRecords,
      stats: {
        total: markedRecords.length,
        present: presentCount,
        absent: absentCount,
        plannedLeave: plannedLeaveCount,
        unplannedAbsent: unplannedAbsentCount
      }
    };

    setSubmissions(prev => ({
      ...prev,
      [submissionId]: newSubmission
    }));

    // Save to Reports state
    const newReport = {
      id: reportId,
      class_id: classId,
      report_date: dateStr,
      total_students: markedRecords.length,
      present_count: presentCount,
      absent_count: unplannedAbsentCount,
      leave_count: plannedLeaveCount,
      attendance_pct: pct,
      teacher_name: currentUser?.name || 'Teacher',
      status: 'PENDING_APPROVAL'
    };

    setDbReports(prev => [newReport, ...prev.filter(r => r.id !== reportId)]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('submissions').upsert({
          id: submissionId,
          class_id: classId,
          submission_date: dateStr,
          timestamp: newSubmission.timestamp,
          teacher_name: newSubmission.teacherName,
          status: 'PENDING_APPROVAL',
          records: markedRecords,
          stats: newSubmission.stats
        });

        // Save Report to Supabase
        await supabase.from('reports').upsert(newReport);
      } catch (e) {
        console.warn('Supabase upsert error:', e);
      }
    }

    showToast(`Attendance & Daily Report for Class ${classId} saved to database!`, 'success');
  };

  // Principal Approves Attendance (Updates Report status to APPROVED in Database)
  const approveAttendance = async (submissionId) => {
    const submission = submissions[submissionId];
    if (!submission) return;

    const approvedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedSubmissions = {
      ...submissions,
      [submissionId]: {
        ...submission,
        status: 'APPROVED',
        approvedAt: approvedTime
      }
    };
    setSubmissions(updatedSubmissions);

    const unplannedAbsents = submission.records.filter(
      r => r.status === 'absent' && !r.plannedLeave
    );

    const newLogs = unplannedAbsents.map(st => ({
      id: `wa-${Date.now()}-${st.rollNo}`,
      studentName: st.name,
      rollNo: st.rollNo,
      classId: submission.classId,
      parentPhone: st.parentPhone,
      message: `Dear Parent, Roll #${st.rollNo} ${st.name} was ABSENT today at school (${submission.classId}) without prior planned leave. Please acknowledge.`,
      timestamp: approvedTime,
      status: 'Sent to WhatsApp',
      acknowledged: false
    }));

    if (newLogs.length > 0) {
      setWhatsappLogs(prev => [...newLogs, ...prev]);
    }

    setApprovalModalData({
      classId: submission.classId,
      teacherName: submission.teacherName,
      stats: submission.stats,
      notifiedStudents: newLogs,
      timestamp: approvedTime
    });

    const dateStr = new Date().toISOString().split('T')[0];
    const reportId = `report_${submission.classId}_${dateStr}`;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('submissions').update({ status: 'APPROVED' }).eq('id', submissionId);
        await supabase.from('reports').update({ status: 'APPROVED' }).eq('id', reportId);

        if (newLogs.length > 0) {
          const supabaseWaRows = newLogs.map(l => ({
            id: l.id,
            student_name: l.studentName,
            roll_no: l.rollNo,
            class_id: l.classId,
            parent_phone: l.parentPhone,
            message: l.message,
            timestamp: l.timestamp,
            status: l.status,
            acknowledged: l.acknowledged
          }));
          await supabase.from('whatsapp_logs').insert(supabaseWaRows);
        }
      } catch (e) {
        console.warn('Supabase approve sync error:', e);
      }
    }

    showToast(`Class ${submission.classId} attendance APPROVED & Report updated in Database!`, 'success');
  };

  // Principal Declines Attendance
  const declineAttendance = async (submissionId, reason = 'Principal requested changes') => {
    const submission = submissions[submissionId];
    if (!submission) return;

    const declinedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedSubmissions = {
      ...submissions,
      [submissionId]: {
        ...submission,
        status: 'DECLINED',
        declineReason: reason,
        declinedAt: declinedTime
      }
    };
    setSubmissions(updatedSubmissions);

    const dateStr = new Date().toISOString().split('T')[0];
    const reportId = `report_${submission.classId}_${dateStr}`;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('submissions').update({
          status: 'DECLINED',
          decline_reason: reason
        }).eq('id', submissionId);

        await supabase.from('reports').update({ status: 'DECLINED' }).eq('id', reportId);
      } catch (e) {
        console.warn('Supabase decline sync error:', e);
      }
    }

    showToast(`Attendance for Class ${submission.classId} DECLINED. Returned to teacher for revision.`, 'error');
  };

  // Leave Applications state
  const [leaveApplications, setLeaveApplications] = useState(() => {
    const saved = localStorage.getItem('schoolzz_leave_applications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'leave-demo-1',
        studentRoll: 2,
        studentName: 'Kabir Das',
        classId: '10-A_morning',
        leaveDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        reason: 'Medical Leave & Hospital Appointment',
        status: 'PENDING_APPROVAL',
        submittedAt: new Date().toISOString().split('T')[0]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('schoolzz_leave_applications', JSON.stringify(leaveApplications));
  }, [leaveApplications]);

  // Submit Pre-Planned Leave Application with Future Date
  const submitLeaveApplication = ({ classId, rollNo, studentName, leaveDate, reason }) => {
    const newApp = {
      id: `leave-${Date.now()}`,
      studentRoll: rollNo,
      studentName: studentName || 'Student',
      classId: classId || '10-A_morning',
      leaveDate: leaveDate || new Date().toISOString().split('T')[0],
      reason: reason || 'Pre-Planned Leave',
      status: 'PENDING_APPROVAL',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    setLeaveApplications(prev => [newApp, ...prev]);

    setStudents(prev => {
      const classList = prev[classId] || [];
      const updatedList = classList.map(st => {
        if (st.rollNo === rollNo) {
          return {
            ...st,
            prePlannedLeave: true,
            leaveDate,
            leaveReason: reason,
            leaveStatus: 'PENDING_APPROVAL'
          };
        }
        return st;
      });
      return { ...prev, [classId]: updatedList };
    });

    showToast(`Pre-planned leave for ${leaveDate} submitted to Principal & Teacher!`, 'success');
  };

  // Principal Approves Leave Application
  const approveLeaveApplication = (leaveId) => {
    const app = leaveApplications.find(l => l.id === leaveId);
    if (!app) return;

    setLeaveApplications(prev => prev.map(l => {
      if (l.id === leaveId) {
        return { ...l, status: 'APPROVED' };
      }
      return l;
    }));

    setStudents(prev => {
      const classList = prev[app.classId] || [];
      const updatedList = classList.map(st => {
        if (st.rollNo === app.studentRoll) {
          return {
            ...st,
            prePlannedLeave: true,
            leaveDate: app.leaveDate,
            leaveReason: app.reason,
            leaveStatus: 'APPROVED'
          };
        }
        return st;
      });
      return { ...prev, [app.classId]: updatedList };
    });

    showToast(`Pre-planned leave for ${app.studentName} APPROVED by Principal!`, 'success');
  };

  // Principal Declines Leave Application
  const declineLeaveApplication = (leaveId, declineReason = 'Declined by Principal') => {
    const app = leaveApplications.find(l => l.id === leaveId);
    if (!app) return;

    setLeaveApplications(prev => prev.map(l => {
      if (l.id === leaveId) {
        return { ...l, status: 'DECLINED', declineReason };
      }
      return l;
    }));

    setStudents(prev => {
      const classList = prev[app.classId] || [];
      const updatedList = classList.map(st => {
        if (st.rollNo === app.studentRoll) {
          return {
            ...st,
            prePlannedLeave: false,
            leaveStatus: 'DECLINED',
            declineReason
          };
        }
        return st;
      });
      return { ...prev, [app.classId]: updatedList };
    });

    showToast(`Pre-planned leave for ${app.studentName} DECLINED by Principal.`, 'error');
  };

  // Legacy fallback
  const applyStudentLeave = (classId, rollNo, leaveData) => {
    submitLeaveApplication({ classId, rollNo, studentName: 'Student', leaveDate: leaveData.leaveDate || new Date().toISOString().split('T')[0], reason: leaveData.reason });
  };

  return (
    <AttendanceContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchRole,
        activeClassId,
        setActiveClassId,
        teachers,
        classes,
        students,
        submissions,
        dbReports,
        whatsappLogs,
        onboardTeacher,
        createClassAndStudents,
        submitTeacherAttendance,
        approveAttendance,
        declineAttendance,
        leaveApplications,
        submitLeaveApplication,
        approveLeaveApplication,
        declineLeaveApplication,
        attendanceReminders,
        triggerManualReminder,
        studentMarks,
        saveStudentMarks,
        examRosters,
        createExamRoster,
        applyStudentLeave,
        toast,
        showToast,
        activeWhatsAppPreview,
        setActiveWhatsAppPreview,
        approvalModalData,
        setApprovalModalData,
        isSupabaseConfigured,
        fetchSupabaseData,
        autoMigrateSupabase
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  return useContext(AttendanceContext);
}
