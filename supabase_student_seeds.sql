-- ========================================================
-- SCHOOLZZ SMART ATTENDANCE - IDENTICAL 15 STUDENTS SEED SCRIPT
-- Copy and paste this into Supabase SQL Editor
-- Class 10A (Morning & Afternoon) shares the EXACT same 15 students
-- Class 10B (Morning & Afternoon) shares the EXACT same 15 students
-- Class 9A  (Morning & Afternoon) shares the EXACT same 15 students
-- ========================================================

-- Clear existing students
DELETE FROM students;

-- ========================================================
-- CLASS 10-A ROSTER (MORNING & AFTERNOON SECTIONS)
-- ========================================================
INSERT INTO students (class_id, roll_no, name, gender, photo, parent_phone, attendance_pct, days_present, days_absent, days_leave) VALUES
-- 10-A Morning
('10-A_morning', 1, 'Isha Kapoor', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 97222 22201', 98, 24, 0.5, 0.5),
('10-A_morning', 2, 'Kabir Das', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 97222 22202', 80, 20, 4, 1),
('10-A_morning', 3, 'Meera Sen', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 97222 22203', 92, 23, 1, 1),
('10-A_morning', 4, 'Neel Saxena', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 97222 22204', 94, 23.5, 1, 0.5),
('10-A_morning', 5, 'Ishaan Reddy', 'Male', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+91 97222 22205', 76, 19, 5, 1),
('10-A_morning', 6, 'Rishi Chawla', 'Male', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '+91 97222 22206', 96, 24, 0.5, 0.5),
('10-A_morning', 7, 'Shreya Pillai', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+91 97222 22207', 90, 22.5, 2, 0.5),
('10-A_morning', 8, 'Sanya Malhotra', 'Female', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '+91 97222 22208', 84, 21, 3, 1),
('10-A_morning', 9, 'Umesh Yadav', 'Male', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '+91 97222 22209', 94, 23.5, 1, 0.5),
('10-A_morning', 10, 'Vaishnavi Iyer', 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+91 97222 22210', 96, 24, 0.5, 0.5),
('10-A_morning', 11, 'Yashasvi Jaiswal', 'Male', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '+91 97222 22211', 98, 24.5, 0.5, 0),
('10-A_morning', 12, 'Yamini Gautam', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 97222 22212', 86, 21.5, 2.5, 1),
('10-A_morning', 13, 'Chetan Bhagat', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 97222 22213', 82, 20.5, 3.5, 1),
('10-A_morning', 14, 'Zainab Fatima', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+91 97222 22214', 90, 22.5, 2, 0.5),
('10-A_morning', 15, 'Barkha Singh', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 97222 22215', 88, 22, 2, 1),

-- 10-A Afternoon (IDENTICAL 15 STUDENTS)
('10-A_afternoon', 1, 'Isha Kapoor', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 97222 22201', 98, 24, 0.5, 0.5),
('10-A_afternoon', 2, 'Kabir Das', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 97222 22202', 80, 20, 4, 1),
('10-A_afternoon', 3, 'Meera Sen', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 97222 22203', 92, 23, 1, 1),
('10-A_afternoon', 4, 'Neel Saxena', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 97222 22204', 94, 23.5, 1, 0.5),
('10-A_afternoon', 5, 'Ishaan Reddy', 'Male', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+91 97222 22205', 76, 19, 5, 1),
('10-A_afternoon', 6, 'Rishi Chawla', 'Male', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '+91 97222 22206', 96, 24, 0.5, 0.5),
('10-A_afternoon', 7, 'Shreya Pillai', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+91 97222 22207', 90, 22.5, 2, 0.5),
('10-A_afternoon', 8, 'Sanya Malhotra', 'Female', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '+91 97222 22208', 84, 21, 3, 1),
('10-A_afternoon', 9, 'Umesh Yadav', 'Male', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '+91 97222 22209', 94, 23.5, 1, 0.5),
('10-A_afternoon', 10, 'Vaishnavi Iyer', 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+91 97222 22210', 96, 24, 0.5, 0.5),
('10-A_afternoon', 11, 'Yashasvi Jaiswal', 'Male', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '+91 97222 22211', 98, 24.5, 0.5, 0),
('10-A_afternoon', 12, 'Yamini Gautam', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 97222 22212', 86, 21.5, 2.5, 1),
('10-A_afternoon', 13, 'Chetan Bhagat', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 97222 22213', 82, 20.5, 3.5, 1),
('10-A_afternoon', 14, 'Zainab Fatima', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+91 97222 22214', 90, 22.5, 2, 0.5),
('10-A_afternoon', 15, 'Barkha Singh', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 97222 22215', 88, 22, 2, 1);

-- ========================================================
-- CLASS 10-B ROSTER (MORNING & AFTERNOON SECTIONS)
-- ========================================================
INSERT INTO students (class_id, roll_no, name, gender, photo, parent_phone, attendance_pct, days_present, days_absent, days_leave) VALUES
-- 10-B Morning
('10-B_morning', 1, 'Aarav Sharma', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 98765 43210', 95, 23.8, 0.7, 0.5),
('10-B_morning', 2, 'Diya Patel', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 98765 43211', 88, 22, 2, 1),
('10-B_morning', 3, 'Chirag Joshi', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 98765 43212', 78, 19.5, 4.5, 1),
('10-B_morning', 4, 'Ananya Roy', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 98765 43213', 92, 23, 1, 1),
('10-B_morning', 5, 'Rohan Verma', 'Male', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+91 98765 43214', 86, 21.5, 2.5, 1),
('10-B_morning', 6, 'Sneha Gupta', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+91 98765 43215', 96, 24, 0.5, 0.5),
('10-B_morning', 7, 'Vikram Singh', 'Male', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '+91 98765 43216', 90, 22.5, 2, 0.5),
('10-B_morning', 8, 'Harsh Vardhan', 'Male', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '+91 98765 43217', 84, 21, 3, 1),
('10-B_morning', 9, 'Pooja Nair', 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+91 98765 43218', 94, 23.5, 1, 0.5),
('10-B_morning', 10, 'Karan Malhotra', 'Male', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '+91 98765 43219', 96, 24, 0.5, 0.5),
('10-B_morning', 11, 'Neha Deshmukh', 'Female', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '+91 98765 43220', 98, 24.5, 0.5, 0),
('10-B_morning', 12, 'Rahul Verma', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 98765 00001', 86, 21.5, 2.5, 1),
('10-B_morning', 13, 'Siddharth Sen', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 98765 43222', 90, 22.5, 2, 0.5),
('10-B_morning', 14, 'Tanya Mehra', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 98765 43223', 92, 23, 1, 1),
('10-B_morning', 15, 'Omkar Kapoor', 'Male', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+91 98765 43224', 82, 20.5, 3.5, 1),

-- 10-B Afternoon (IDENTICAL 15 STUDENTS)
('10-B_afternoon', 1, 'Aarav Sharma', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 98765 43210', 95, 23.8, 0.7, 0.5),
('10-B_afternoon', 2, 'Diya Patel', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 98765 43211', 88, 22, 2, 1),
('10-B_afternoon', 3, 'Chirag Joshi', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 98765 43212', 78, 19.5, 4.5, 1),
('10-B_afternoon', 4, 'Ananya Roy', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 98765 43213', 92, 23, 1, 1),
('10-B_afternoon', 5, 'Rohan Verma', 'Male', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+91 98765 43214', 86, 21.5, 2.5, 1),
('10-B_afternoon', 6, 'Sneha Gupta', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+91 98765 43215', 96, 24, 0.5, 0.5),
('10-B_afternoon', 7, 'Vikram Singh', 'Male', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '+91 98765 43216', 90, 22.5, 2, 0.5),
('10-B_afternoon', 8, 'Harsh Vardhan', 'Male', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '+91 98765 43217', 84, 21, 3, 1),
('10-B_afternoon', 9, 'Pooja Nair', 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+91 98765 43218', 94, 23.5, 1, 0.5),
('10-B_afternoon', 10, 'Karan Malhotra', 'Male', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '+91 98765 43219', 96, 24, 0.5, 0.5),
('10-B_afternoon', 11, 'Neha Deshmukh', 'Female', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '+91 98765 43220', 98, 24.5, 0.5, 0),
('10-B_afternoon', 12, 'Rahul Verma', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 98765 00001', 86, 21.5, 2.5, 1),
('10-B_afternoon', 13, 'Siddharth Sen', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 98765 43222', 90, 22.5, 2, 0.5),
('10-B_afternoon', 14, 'Tanya Mehra', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 98765 43223', 92, 23, 1, 1),
('10-B_afternoon', 15, 'Omkar Kapoor', 'Male', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+91 98765 43224', 82, 20.5, 3.5, 1);

-- ========================================================
-- CLASS 9-A ROSTER (MORNING & AFTERNOON SECTIONS)
-- ========================================================
INSERT INTO students (class_id, roll_no, name, gender, photo, parent_phone, attendance_pct, days_present, days_absent, days_leave) VALUES
-- 9-A Morning
('9-A_morning', 1, 'Aditya Rao', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 97111 22301', 96, 24, 1, 0),
('9-A_morning', 2, 'Bhavna Kulkarni', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 97111 22302', 92, 23, 1.5, 0.5),
('9-A_morning', 3, 'Devansh Singhania', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 97111 22303', 88, 22, 2, 1),
('9-A_morning', 4, 'Esha Choudhury', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 97111 22304', 94, 23.5, 1, 0.5),
('9-A_morning', 5, 'Farhan Ali', 'Male', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+91 97111 22305', 76, 19, 5, 1),
('9-A_morning', 6, 'Gayatri Joshi', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+91 97111 22306', 98, 24.5, 0.5, 0),
('9-A_morning', 7, 'Hrithik Mehta', 'Male', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '+91 97111 22307', 90, 22.5, 2, 0.5),
('9-A_morning', 8, 'Ishita Pillai', 'Female', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '+91 97111 22308', 84, 21, 3, 1),
('9-A_morning', 9, 'Jatin Bhatia', 'Male', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '+91 97111 22309', 94, 23.5, 1, 0.5),
('9-A_morning', 10, 'Kavya Nambiar', 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+91 97111 22310', 96, 24, 0.5, 0.5),
('9-A_morning', 11, 'Lokesh Dutt', 'Male', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '+91 97111 22311', 98, 24.5, 0.5, 0),
('9-A_morning', 12, 'Manasi Deshpande', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 97111 22312', 86, 21.5, 2.5, 1),
('9-A_morning', 13, 'Nikhil Saxena', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 97111 22313', 82, 20.5, 3.5, 1),
('9-A_morning', 14, 'Payal Mittal', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 97111 22314', 90, 22.5, 2, 0.5),
('9-A_morning', 15, 'Rithvik Shah', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 97111 22315', 88, 22, 2, 1),

-- 9-A Afternoon (IDENTICAL 15 STUDENTS)
('9-A_afternoon', 1, 'Aditya Rao', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 97111 22301', 96, 24, 1, 0),
('9-A_afternoon', 2, 'Bhavna Kulkarni', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 97111 22302', 92, 23, 1.5, 0.5),
('9-A_afternoon', 3, 'Devansh Singhania', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 97111 22303', 88, 22, 2, 1),
('9-A_afternoon', 4, 'Esha Choudhury', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 97111 22304', 94, 23.5, 1, 0.5),
('9-A_afternoon', 5, 'Farhan Ali', 'Male', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+91 97111 22305', 76, 19, 5, 1),
('9-A_afternoon', 6, 'Gayatri Joshi', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+91 97111 22306', 98, 24.5, 0.5, 0),
('9-A_afternoon', 7, 'Hrithik Mehta', 'Male', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '+91 97111 22307', 90, 22.5, 2, 0.5),
('9-A_afternoon', 8, 'Ishita Pillai', 'Female', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '+91 97111 22308', 84, 21, 3, 1),
('9-A_afternoon', 9, 'Jatin Bhatia', 'Male', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '+91 97111 22309', 94, 23.5, 1, 0.5),
('9-A_afternoon', 10, 'Kavya Nambiar', 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+91 97111 22310', 96, 24, 0.5, 0.5),
('9-A_afternoon', 11, 'Lokesh Dutt', 'Male', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '+91 97111 22311', 98, 24.5, 0.5, 0),
('9-A_afternoon', 12, 'Manasi Deshpande', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+91 97111 22312', 86, 21.5, 2.5, 1),
('9-A_afternoon', 13, 'Nikhil Saxena', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+91 97111 22313', 82, 20.5, 3.5, 1),
('9-A_afternoon', 14, 'Payal Mittal', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+91 97111 22314', 90, 22.5, 2, 0.5),
('9-A_afternoon', 15, 'Rithvik Shah', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+91 97111 22315', 88, 22, 2, 1);
