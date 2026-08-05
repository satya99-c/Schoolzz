// Login Records & Authentication Credentials for Students, Teachers, and Principal

export const PRINCIPAL_LOGINS = [
  {
    id: "prin-1",
    principalId: "PRIN-001",
    name: "Dr. Rajesh Sharma",
    email: "principal@schoolzz.edu",
    username: "principal",
    password: "principal123",
    role: "PRINCIPAL",
    schoolName: "Delhi Public School",
    phone: "+91 98765 43210",
    status: "ACTIVE"
  }
];

export const TEACHER_LOGINS = [
  {
    id: "tch-1",
    teacherId: "TCH-001",
    name: "Mr. Sharma (Teacher 1)",
    email: "sharma@schoolzz.edu",
    username: "teacher1",
    password: "teacher123",
    role: "TEACHER",
    assignedClasses: ["10-A_morning"],
    department: "Mathematics",
    phone: "+91 98123 45678",
    status: "ACTIVE"
  },
  {
    id: "tch-2",
    teacherId: "TCH-002",
    name: "Mrs. Kapoor (Teacher 2)",
    email: "kapoor@schoolzz.edu",
    username: "teacher2",
    password: "teacher123",
    role: "TEACHER",
    assignedClasses: ["9-A_morning"],
    department: "Science",
    phone: "+91 98123 45679",
    status: "ACTIVE"
  }
];

export const STUDENT_LOGINS = [
  {
    id: "stu-1",
    studentId: "STU-10A-01",
    rollNo: 1,
    name: "Isha Kapoor",
    classId: "10-A_morning",
    username: "isha.kapoor",
    passcode: "1001",
    role: "STUDENT",
    parentPhone: "+91 97222 22201",
    gender: "Female",
    status: "ACTIVE"
  },
  {
    id: "stu-2",
    studentId: "STU-10A-02",
    rollNo: 2,
    name: "Kabir Das",
    classId: "10-A_morning",
    username: "kabir.das",
    passcode: "1002",
    role: "STUDENT",
    parentPhone: "+91 97222 22202",
    gender: "Male",
    status: "ACTIVE"
  },
  {
    id: "stu-3",
    studentId: "STU-10A-03",
    rollNo: 3,
    name: "Aanya Sen",
    classId: "10-A_morning",
    username: "aanya.sen",
    passcode: "1003",
    role: "STUDENT",
    parentPhone: "+91 97222 22203",
    gender: "Female",
    status: "ACTIVE"
  },
  {
    id: "stu-4",
    studentId: "STU-10A-04",
    rollNo: 4,
    name: "Vihaan Mehta",
    classId: "10-A_morning",
    username: "vihaan.mehta",
    passcode: "1004",
    role: "STUDENT",
    parentPhone: "+91 97222 22204",
    gender: "Male",
    status: "ACTIVE"
  },
  {
    id: "stu-5",
    studentId: "STU-10A-05",
    rollNo: 5,
    name: "Ananya Roy",
    classId: "10-A_morning",
    username: "ananya.roy",
    passcode: "1005",
    role: "STUDENT",
    parentPhone: "+91 97222 22205",
    gender: "Female",
    status: "ACTIVE"
  }
];
