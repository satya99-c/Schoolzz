// Updated mock dataset with identical 15 Students rosters shared between Morning & Afternoon shifts for Class 10A, 10B, 9A

export const INITIAL_CLASSES = [
  {
    id: "10-A_morning",
    name: "Class 10 - Section A",
    shift: "Morning Section",
    shiftTime: "08:00 AM - 12:00 PM",
    grade: "10",
    section: "A",
    teacherId: "user-teacher-1",
    classTeacher: "Mr. Sharma (Teacher 1)",
    totalStudents: 15
  },
  {
    id: "10-A_afternoon",
    name: "Class 10 - Section A",
    shift: "Afternoon Section",
    shiftTime: "12:30 PM - 04:30 PM",
    grade: "10",
    section: "A",
    teacherId: "user-teacher-1",
    classTeacher: "Mr. Sharma (Teacher 1)",
    totalStudents: 15
  },
  {
    id: "9-A_morning",
    name: "Class 9 - Section A",
    shift: "Morning Section",
    shiftTime: "08:00 AM - 12:00 PM",
    grade: "9",
    section: "A",
    teacherId: "user-teacher-2",
    classTeacher: "Mrs. Kapoor (Teacher 2)",
    totalStudents: 15
  },
  {
    id: "9-A_afternoon",
    name: "Class 9 - Section A",
    shift: "Afternoon Section",
    shiftTime: "12:30 PM - 04:30 PM",
    grade: "9",
    section: "A",
    teacherId: "user-teacher-2",
    classTeacher: "Mrs. Kapoor (Teacher 2)",
    totalStudents: 15
  },
  {
    id: "10-B_morning",
    name: "Class 10 - Section B",
    shift: "Morning Section",
    shiftTime: "08:00 AM - 12:00 PM",
    grade: "10",
    section: "B",
    teacherId: "user-teacher-3",
    classTeacher: "Ms. Ananya (Teacher 3)",
    totalStudents: 15
  },
  {
    id: "10-B_afternoon",
    name: "Class 10 - Section B",
    shift: "Afternoon Section",
    shiftTime: "12:30 PM - 04:30 PM",
    grade: "10",
    section: "B",
    teacherId: "user-teacher-3",
    classTeacher: "Ms. Ananya (Teacher 3)",
    totalStudents: 15
  }
];

// 1. MASTER ROSTER FOR CLASS 10-A (Shared by Morning & Afternoon Sections)
const STUDENTS_10A = [
  { rollNo: 1, name: "Isha Kapoor", gender: "Female", parentPhone: "+91 97222 22201", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", prePlannedLeave: false, attendancePct: 98, daysPresent: 24, daysAbsent: 0.5, daysLeave: 0.5 },
  { rollNo: 2, name: "Kabir Das", gender: "Male", parentPhone: "+91 97222 22202", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", prePlannedLeave: false, attendancePct: 80, daysPresent: 20, daysAbsent: 4, daysLeave: 1 },
  { rollNo: 3, name: "Meera Sen", gender: "Female", parentPhone: "+91 97222 22203", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", prePlannedLeave: false, attendancePct: 92, daysPresent: 23, daysAbsent: 1, daysLeave: 1 },
  { rollNo: 4, name: "Neel Saxena", gender: "Male", parentPhone: "+91 97222 22204", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", prePlannedLeave: false, attendancePct: 94, daysPresent: 23.5, daysAbsent: 1, daysLeave: 0.5 },
  { rollNo: 5, name: "Ishaan Reddy", gender: "Male", parentPhone: "+91 97222 22205", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", prePlannedLeave: false, attendancePct: 76, daysPresent: 19, daysAbsent: 5, daysLeave: 1 },
  { rollNo: 6, name: "Rishi Chawla", gender: "Male", parentPhone: "+91 97222 22206", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", prePlannedLeave: false, attendancePct: 96, daysPresent: 24, daysAbsent: 0.5, daysLeave: 0.5 },
  { rollNo: 7, name: "Shreya Pillai", gender: "Female", parentPhone: "+91 97222 22207", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", prePlannedLeave: false, attendancePct: 90, daysPresent: 22.5, daysAbsent: 2, daysLeave: 0.5 },
  { rollNo: 8, name: "Sanya Malhotra", gender: "Female", parentPhone: "+91 97222 22208", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", prePlannedLeave: false, attendancePct: 84, daysPresent: 21, daysAbsent: 3, daysLeave: 1 },
  { rollNo: 9, name: "Umesh Yadav", gender: "Male", parentPhone: "+91 97222 22209", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", prePlannedLeave: false, attendancePct: 94, daysPresent: 23.5, daysAbsent: 1, daysLeave: 0.5 },
  { rollNo: 10, name: "Vaishnavi Iyer", gender: "Female", parentPhone: "+91 97222 22210", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", prePlannedLeave: false, attendancePct: 96, daysPresent: 24, daysAbsent: 0.5, daysLeave: 0.5 },
  { rollNo: 11, name: "Yashasvi Jaiswal", gender: "Male", parentPhone: "+91 97222 22211", photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150", prePlannedLeave: false, attendancePct: 98, daysPresent: 24.5, daysAbsent: 0.5, daysLeave: 0 },
  { rollNo: 12, name: "Yamini Gautam", gender: "Female", parentPhone: "+91 97222 22212", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", prePlannedLeave: false, attendancePct: 86, daysPresent: 21.5, daysAbsent: 2.5, daysLeave: 1 },
  { rollNo: 13, name: "Chetan Bhagat", gender: "Male", parentPhone: "+91 97222 22213", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", prePlannedLeave: false, attendancePct: 82, daysPresent: 20.5, daysAbsent: 3.5, daysLeave: 1 },
  { rollNo: 14, name: "Zainab Fatima", gender: "Female", parentPhone: "+91 97222 22214", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", prePlannedLeave: false, attendancePct: 90, daysPresent: 22.5, daysAbsent: 2, daysLeave: 0.5 },
  { rollNo: 15, name: "Barkha Singh", gender: "Female", parentPhone: "+91 97222 22215", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", prePlannedLeave: false, attendancePct: 88, daysPresent: 22, daysAbsent: 2, daysLeave: 1 }
];

// 2. MASTER ROSTER FOR CLASS 10-B (Shared by Morning & Afternoon Sections)
const STUDENTS_10B = [
  { rollNo: 1, name: "Aarav Sharma", gender: "Male", parentPhone: "+91 98765 43210", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", prePlannedLeave: false, attendancePct: 95, daysPresent: 23.8, daysAbsent: 0.7, daysLeave: 0.5 },
  { rollNo: 2, name: "Diya Patel", gender: "Female", parentPhone: "+91 98765 43211", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", prePlannedLeave: false, attendancePct: 88, daysPresent: 22, daysAbsent: 2, daysLeave: 1 },
  { rollNo: 3, name: "Chirag Joshi", gender: "Male", parentPhone: "+91 98765 43212", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", prePlannedLeave: false, attendancePct: 78, daysPresent: 19.5, daysAbsent: 4.5, daysLeave: 1 },
  { rollNo: 4, name: "Ananya Roy", gender: "Female", parentPhone: "+91 98765 43213", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", prePlannedLeave: false, attendancePct: 92, daysPresent: 23, daysAbsent: 1, daysLeave: 1 },
  { rollNo: 5, name: "Rohan Verma", gender: "Male", parentPhone: "+91 98765 43214", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", prePlannedLeave: false, attendancePct: 86, daysPresent: 21.5, daysAbsent: 2.5, daysLeave: 1 },
  { rollNo: 6, name: "Sneha Gupta", gender: "Female", parentPhone: "+91 98765 43215", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", prePlannedLeave: false, attendancePct: 96, daysPresent: 24, daysAbsent: 0.5, daysLeave: 0.5 },
  { rollNo: 7, name: "Vikram Singh", gender: "Male", parentPhone: "+91 98765 43216", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", prePlannedLeave: false, attendancePct: 90, daysPresent: 22.5, daysAbsent: 2, daysLeave: 0.5 },
  { rollNo: 8, name: "Harsh Vardhan", gender: "Male", parentPhone: "+91 98765 43217", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", prePlannedLeave: false, attendancePct: 84, daysPresent: 21, daysAbsent: 3, daysLeave: 1 },
  { rollNo: 9, name: "Pooja Nair", gender: "Female", parentPhone: "+91 98765 43218", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", prePlannedLeave: false, attendancePct: 94, daysPresent: 23.5, daysAbsent: 1, daysLeave: 0.5 },
  { rollNo: 10, name: "Karan Malhotra", gender: "Male", parentPhone: "+91 98765 43219", photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150", prePlannedLeave: false, attendancePct: 96, daysPresent: 24, daysAbsent: 0.5, daysLeave: 0.5 },
  { rollNo: 11, name: "Neha Deshmukh", gender: "Female", parentPhone: "+91 98765 43220", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", prePlannedLeave: false, attendancePct: 98, daysPresent: 24.5, daysAbsent: 0.5, daysLeave: 0 },
  { rollNo: 12, name: "Rahul Verma", gender: "Male", parentPhone: "+91 98765 00001", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", prePlannedLeave: false, attendancePct: 86, daysPresent: 21.5, daysAbsent: 2.5, daysLeave: 1 },
  { rollNo: 13, name: "Siddharth Sen", gender: "Male", parentPhone: "+91 98765 43222", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", prePlannedLeave: false, attendancePct: 90, daysPresent: 22.5, daysAbsent: 2, daysLeave: 0.5 },
  { rollNo: 14, name: "Tanya Mehra", gender: "Female", parentPhone: "+91 98765 43223", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", prePlannedLeave: false, attendancePct: 92, daysPresent: 23, daysAbsent: 1, daysLeave: 1 },
  { rollNo: 15, name: "Omkar Kapoor", gender: "Male", parentPhone: "+91 98765 43224", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", prePlannedLeave: false, attendancePct: 82, daysPresent: 20.5, daysAbsent: 3.5, daysLeave: 1 }
];

// 3. MASTER ROSTER FOR CLASS 9-A (Shared by Morning & Afternoon Sections)
const STUDENTS_9A = [
  { rollNo: 1, name: "Aditya Rao", gender: "Male", parentPhone: "+91 97111 22301", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", prePlannedLeave: false, attendancePct: 96, daysPresent: 24, daysAbsent: 1, daysLeave: 0 },
  { rollNo: 2, name: "Bhavna Kulkarni", gender: "Female", parentPhone: "+91 97111 22302", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", prePlannedLeave: false, attendancePct: 92, daysPresent: 23, daysAbsent: 1.5, daysLeave: 0.5 },
  { rollNo: 3, name: "Devansh Singhania", gender: "Male", parentPhone: "+91 97111 22303", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", prePlannedLeave: false, attendancePct: 88, daysPresent: 22, daysAbsent: 2, daysLeave: 1 },
  { rollNo: 4, name: "Esha Choudhury", gender: "Female", parentPhone: "+91 97111 22304", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", prePlannedLeave: false, attendancePct: 94, daysPresent: 23.5, daysAbsent: 1, daysLeave: 0.5 },
  { rollNo: 5, name: "Farhan Ali", gender: "Male", parentPhone: "+91 97111 22305", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", prePlannedLeave: false, attendancePct: 76, daysPresent: 19, daysAbsent: 5, daysLeave: 1 },
  { rollNo: 6, name: "Gayatri Joshi", gender: "Female", parentPhone: "+91 97111 22306", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", prePlannedLeave: false, attendancePct: 98, daysPresent: 24.5, daysAbsent: 0.5, daysLeave: 0 },
  { rollNo: 7, name: "Hrithik Mehta", gender: "Male", parentPhone: "+91 97111 22307", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", prePlannedLeave: false, attendancePct: 90, daysPresent: 22.5, daysAbsent: 2, daysLeave: 0.5 },
  { rollNo: 8, name: "Ishita Pillai", gender: "Female", parentPhone: "+91 97111 22308", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", prePlannedLeave: false, attendancePct: 84, daysPresent: 21, daysAbsent: 3, daysLeave: 1 },
  { rollNo: 9, name: "Jatin Bhatia", gender: "Male", parentPhone: "+91 97111 22309", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", prePlannedLeave: false, attendancePct: 94, daysPresent: 23.5, daysAbsent: 1, daysLeave: 0.5 },
  { rollNo: 10, name: "Kavya Nambiar", gender: "Female", parentPhone: "+91 97111 22310", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", prePlannedLeave: false, attendancePct: 96, daysPresent: 24, daysAbsent: 0.5, daysLeave: 0.5 },
  { rollNo: 11, name: "Lokesh Dutt", gender: "Male", parentPhone: "+91 97111 22311", photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150", prePlannedLeave: false, attendancePct: 98, daysPresent: 24.5, daysAbsent: 0.5, daysLeave: 0 },
  { rollNo: 12, name: "Manasi Deshpande", gender: "Female", parentPhone: "+91 97111 22312", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", prePlannedLeave: false, attendancePct: 86, daysPresent: 21.5, daysAbsent: 2.5, daysLeave: 1 },
  { rollNo: 13, name: "Nikhil Saxena", gender: "Male", parentPhone: "+91 97111 22313", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", prePlannedLeave: false, attendancePct: 82, daysPresent: 20.5, daysAbsent: 3.5, daysLeave: 1 },
  { rollNo: 14, name: "Payal Mittal", gender: "Female", parentPhone: "+91 97111 22314", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", prePlannedLeave: false, attendancePct: 90, daysPresent: 22.5, daysAbsent: 2, daysLeave: 0.5 },
  { rollNo: 15, name: "Rithvik Shah", gender: "Male", parentPhone: "+91 97111 22315", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", prePlannedLeave: false, attendancePct: 88, daysPresent: 22, daysAbsent: 2, daysLeave: 1 }
];

export const INITIAL_STUDENTS = {
  "10-A_morning": STUDENTS_10A,
  "10-A_afternoon": STUDENTS_10A,
  "10-B_morning": STUDENTS_10B,
  "10-B_afternoon": STUDENTS_10B,
  "9-A_morning": STUDENTS_9A,
  "9-A_afternoon": STUDENTS_9A
};

export const MOCK_USERS = [
  {
    id: "user-teacher-1",
    username: "teacher1",
    password: "teacher1",
    name: "Mr. Sharma (Teacher 1)",
    role: "teacher",
    avatar: "👨‍🏫",
    assignedClasses: ["10-A_morning", "10-B_afternoon"],
    classTeacherClassId: "10-A_morning"
  },
  {
    id: "user-teacher-2",
    username: "teacher2",
    password: "teacher2",
    name: "Mrs. Kapoor (Teacher 2)",
    role: "teacher",
    avatar: "👩‍🏫",
    assignedClasses: ["9-A_morning", "10-A_afternoon"],
    classTeacherClassId: "9-A_morning"
  },
  {
    id: "user-teacher-3",
    username: "teacher3",
    password: "teacher3",
    name: "Ms. Ananya (Teacher 3)",
    role: "teacher",
    avatar: "👩‍🏫",
    assignedClasses: ["10-B_afternoon", "9-A_afternoon"],
    classTeacherClassId: "10-B_afternoon"
  },
  {
    id: "user-teacher-default",
    username: "teacher",
    password: "teacher",
    name: "Mr. Sharma (Teacher 1)",
    role: "teacher",
    avatar: "👨‍🏫",
    assignedClasses: ["10-A_morning", "10-B_afternoon"],
    classTeacherClassId: "10-A_morning"
  },
  {
    id: "user-principal",
    username: "principal",
    password: "principal",
    name: "Dr. V. K. Rao",
    role: "principal",
    avatar: "🎓",
    title: "School Principal"
  },
  {
    id: "user-student",
    username: "student",
    password: "student",
    name: "Isha Kapoor",
    rollNo: 1,
    classId: "10-A_morning",
    role: "student",
    avatar: "👧"
  }
];
