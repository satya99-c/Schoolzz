# 🏫 Schoolzz — Smart School Attendance, Exam Rosters & Academic Analytics System

> **Schoolzz** is a modern, high-performance web platform built for schools to seamlessly manage daily student attendance, automated reminder alerts, exam mark rosters, academic scorecards, and multi-portal performance reports for Teachers, Principals, and Students.

---

## ✨ Features Overview

### 👩‍🏫 1. Teacher Portal & Attendance Deck
- **Card Deck Interface**: Swipe / tap student cards with large **PRESENT** and **ABSENT** buttons.
- **Quick "All Present" Prompt**: One-click confirmation modal before launching the card deck to instantly mark 100% attendance.
- **Planned Leave Handling**: Prompts teachers for planned vs. unplanned leave when marking a student absent.
- **Pre-Submission Review & Cross-Check**: Overview screen to audit present/absent counts before sending to the Principal.
- **Quick Edit on Roster**: Change any student's status directly from the review page or return to the card deck via the inline **Submit** button.
- **Automated Grace Period Reminders**: 3-tier automated alerts for morning (08:00 AM) and afternoon (12:30 PM) sessions.

### 📝 2. Academic Exam Mark Rosters & Cutoff Logic
- **Create Exam Roster Modal**: Teachers can create new custom exam rosters (e.g., *Mid-Term Examination 2026*, *Unit Test 1*, *Final Exams*) with custom subject suites.
- **Subject Coverage**: Mathematics, Science, English, Social Studies, and Physics (100 Marks each; Total 500 Marks).
- **Pass / Fail Rules**:
  - **Subject Cutoff**: Scoring `< 35` marks in **ANY** subject automatically marks the student status as **`FAILED`** (displayed in Red).
  - **Letter Grade**: Strictly calculated from total percentage scored (`A+` ≥ 90%, `A` ≥ 80%, `B` ≥ 70%, `C` ≥ 60%, `D` ≥ 50%, `F` < 50%).
- **Empty Roster Initialization**: Newly created exam rosters start 100% empty for all students until teachers input scores.
- **Non-Editable Locked Exam Title**: Locked exam title field inside the Add Marks popup for accuracy.

### 👔 3. Principal Portal & Overview Analytics
- **Unified Class-Wise Cards**: Displays clean, non-duplicate class cards (*Class 10 - Section A*, *Class 10 - Section B*, *Class 9 - Section A*) combining shift sessions and faculty names.
- **Real Average Percentage Calculations**: Displays the exact average score for classes with submitted scorecards and `Avg: N/A` when no scorecards exist.
- **Deduplicated Master Directory**: Displays unique student records across shift sessions.
- **Dynamic Date Range Analytics**: Graphs capped strictly to the last submitted attendance date.
- **One-Click Approval / Decline**: Approve attendance submissions or decline with feedback notes.

### 🎓 4. Student Portal & Digital Scorecard
- **Official Digital Scorecard**: Logged-in students (e.g., *Isha Kapoor*) view individual subject marks, total score, percentage, grade, status badge, and teacher remarks.
- **Attendance Percentage Indicator**: Live calculation showing attendance eligibility (`≥ 80%` displays in Green, `< 80%` displays in Red).

---

## 🛠️ Technology Stack

| Component | Technology Used |
| :--- | :--- |
| **Frontend Framework** | **React 18** (Vite 8 Build System) |
| **State Management** | **React Context API** (`AttendanceContext.jsx`) |
| **Styling & Design** | **Tailwind CSS v3**, Custom HSL Color Tokens, Glassmorphism |
| **Icons & Charts** | **Lucide React**, **Recharts** |
| **Backend & Storage** | **Supabase** (PostgreSQL) + LocalStorage Sync Fallback |
| **Deployment** | **Vercel** (`vercel.json` SPA rewrite configuration) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/satya99-c/Schoolzz.git

# Navigate into project directory
cd Schoolzz

# Install dependencies
npm install

# Start local dev server
npm run dev
```

The application will launch at `http://localhost:5174/` (or `http://localhost:5173/`).

---

## 📂 Project Structure

```
Schoolzz/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/              # Logos and static media
│   ├── components/          # Navigation and global modals
│   ├── context/
│   │   └── AttendanceContext.jsx # Global state, marks, rosters & Supabase sync
│   ├── data/
│   │   ├── mockData.js      # Default mock class & student seeds
│   │   └── userLoginsData.js# Multi-portal login credentials
│   ├── lib/
│   │   └── supabaseClient.js# Supabase BaaS connection
│   ├── portals/
│   │   ├── AuthPortal.jsx   # Multi-role authentication (Teacher, Principal, Student)
│   │   ├── TeacherPortal.jsx# Daily attendance & exam roster management
│   │   ├── PrincipalPortal.jsx # Approval dashboard & class analytics
│   │   └── StudentPortal.jsx# Digital scorecards & attendance view
│   └── subcomponents/
│       ├── AddMarksModal.jsx   # Subject marks entry modal
│       ├── AttendanceDeck.jsx  # Card deck swipe/tap attendance intake
│       ├── AttendanceSummary.jsx # Pre-submission review screen
│       ├── PrincipalReports.jsx# Attendance breakdown & master directory
│       └── TeacherReports.jsx  # Teacher class analytics & capped date range charts
├── vercel.json              # Vercel SPA routing rewrite config
├── vite.config.js           # Vite configuration
└── package.json             # Project dependencies & scripts
```

---

## 🌐 Deploying to Vercel

1. Push your code to GitHub (`satya99-c/Schoolzz`).
2. Log into [Vercel](https://vercel.com/) and click **`Add New Project`**.
3. Import **`satya99-c/Schoolzz`**.
4. Set Framework Preset to **Vite** (Vercel automatically detects `vercel.json`).
5. Click **Deploy**!

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
