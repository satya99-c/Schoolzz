import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { getTodayLocalDateStr, getTomorrowLocalDateStr } from '../utils/dateUtils';
import StudentReportModal from '../subcomponents/StudentReportModal';
import { GraduationCap, CalendarCheck, Clock, ShieldAlert, CheckCircle2, XCircle, FileText, Calendar, Award, BookOpen } from 'lucide-react';

export default function StudentPortal() {
  const { currentUser, students, leaveApplications = [], submitLeaveApplication, studentMarks } = useAttendance();

  const studentClassId = currentUser?.classId || '10-A_morning';
  const classStudents = students[studentClassId] || [];
  const currentStudent = classStudents.find(st => st.rollNo === (currentUser?.rollNo || 1)) || classStudents[0] || {
    rollNo: 1,
    name: currentUser?.name || 'Isha Kapoor',
    gender: 'Female',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    parentPhone: '+91 97222 22201',
    attendancePct: 96,
    daysPresent: 24,
    daysAbsent: 0.5,
    daysLeave: 0.5,
    prePlannedLeave: false
  };

  const [leaveDate, setLeaveDate] = useState(() => getTomorrowLocalDateStr());
  const [leaveReason, setLeaveReason] = useState('');
  const [showReportCard, setShowReportCard] = useState(false);

  // Filter leave applications for this student
  const studentApps = leaveApplications.filter(app => app.studentRoll === currentStudent.rollNo);

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveReason.trim() || !leaveDate) return;

    submitLeaveApplication({
      classId: studentClassId,
      rollNo: currentStudent.rollNo,
      studentName: currentStudent.name,
      leaveDate,
      reason: leaveReason
    });

    setLeaveReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Student Portal Header */}
      <div className="bg-[#1b4d3e] text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentStudent.photo}
              alt={currentStudent.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-300 shadow-md"
            />
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-800/80 text-emerald-100 text-xs px-3 py-1 rounded-full border border-emerald-400/30 font-semibold mb-1">
                <GraduationCap className="w-4 h-4 text-emerald-300" />
                <span>Student Portal • Class 10-A (Morning & Afternoon Sessions)</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{currentStudent.name}</h1>
              <p className="text-xs text-emerald-100/90">Roll Number #{currentStudent.rollNo} • Parent Contact: {currentStudent.parentPhone}</p>
            </div>
          </div>

          <button
            onClick={() => setShowReportCard(true)}
            className="px-5 py-2.5 rounded-2xl bg-white text-[#1b4d3e] font-black text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#1b4d3e]" />
            <span>View 3-Month Performance Overview</span>
          </button>
        </div>
      </div>

      {/* Dual Session Attendance Summary Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#1b4d3e]" />
            <span>Session-Wise Attendance Breakdown (Both Sessions Considered)</span>
          </h3>
          <span className="text-xs font-bold text-[#1b4d3e] bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
            Combined Average: {currentStudent.attendancePct || 92}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                Morning Session (08:00 AM - 12:00 PM)
              </span>
              <div className="text-xs font-bold text-slate-800 mt-1">Class 10-A Morning Shift</div>
            </div>
            <span className="text-lg font-black text-[#1b4d3e] font-mono">{Math.min(100, (currentStudent.attendancePct || 92) + 2)}%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                Afternoon Session (12:30 PM - 04:30 PM)
              </span>
              <div className="text-xs font-bold text-slate-800 mt-1">Class 10-A Afternoon Shift</div>
            </div>
            <span className="text-lg font-black text-[#1b4d3e] font-mono">{Math.max(0, (currentStudent.attendancePct || 92) - 2)}%</span>
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Overall Attendance</div>
          <div className="text-3xl font-black text-[#1b4d3e] mt-1">{currentStudent.attendancePct || 92}%</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">✓ Good Standing (&gt;80%)</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Days Present</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{currentStudent.daysPresent || 23} Days</div>
          <div className="text-[11px] text-slate-500 mt-1">Classes attended</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Planned Leaves</div>
          <div className="text-3xl font-black text-amber-600 mt-1">{currentStudent.daysLeave || 0.5} Days</div>
          <div className="text-[11px] text-slate-500 mt-1">Prior approved leaves</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Unplanned Absences</div>
          <div className="text-3xl font-black text-rose-600 mt-1">{currentStudent.daysAbsent || 1.5} Days</div>
          <div className="text-[11px] text-slate-500 mt-1">Absent without leave</div>
        </div>
      </div>

      {/* Official Academic Examination Scorecard Card */}
      {(() => {
        const myClassMarks = studentMarks[studentClassId] || [];
        const myRecord = myClassMarks.find(r => r.rollNo === currentStudent.rollNo) || {
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
          submittedAt: 'Verified & Approved'
        };

        return (
          <div className="bg-[#1b4d3e] text-white border border-emerald-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/60 pb-5">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 text-emerald-300 flex items-center justify-center border border-emerald-600 shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                    <span>🏆 Official Academic Scorecard</span>
                  </div>
                  <h3 className="text-lg font-black text-white">{myRecord.examName}</h3>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-xs font-black px-3.5 py-1.5 rounded-full inline-block font-mono">
                  Grade {myRecord.grade} • {myRecord.status}
                </span>
                <div className="text-[11px] text-emerald-200/80 mt-1 font-mono">
                  Total: {myRecord.totalMarks} / {myRecord.maxMarks} ({myRecord.percentage}%)
                </div>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-emerald-100">
                <thead className="bg-[#143c30] text-emerald-300 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Subject Name</th>
                    <th className="p-3">Marks Obtained</th>
                    <th className="p-3">Max Marks</th>
                    <th className="p-3">Performance Bar</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-800/60 font-medium">
                  {Object.entries(myRecord.subjects).map(([subject, mark]) => (
                    <tr key={subject} className="hover:bg-emerald-800/30 transition-colors">
                      <td className="p-3 font-bold text-white flex items-center space-x-2">
                        <span>{subject === 'Mathematics' ? '📐' : subject === 'Science' ? '🔬' : subject === 'English' ? '📖' : subject === 'SocialStudies' ? '🌍' : '⚡'}</span>
                        <span>{subject}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-200 text-sm">{mark}</td>
                      <td className="p-3 font-mono text-emerald-300/80">100</td>
                      <td className="p-3">
                        <div className="w-32 h-2 bg-emerald-950 rounded-full overflow-hidden border border-emerald-700/50">
                          <div
                            className={`h-full ${mark >= 90 ? 'bg-emerald-400' : mark >= 80 ? 'bg-emerald-300' : 'bg-amber-400'}`}
                            style={{ width: `${mark}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-800/80 px-2 py-0.5 rounded-md">
                          {mark >= 90 ? 'A+' : mark >= 80 ? 'A' : mark >= 70 ? 'B' : 'C'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Remarks Footer */}
            <div className="bg-[#143c30] border border-emerald-700/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-100">
              <div>
                <span className="font-bold text-emerald-300 uppercase text-[10px] block mb-0.5">Teacher Remarks:</span>
                <p className="italic">"{myRecord.remarks}"</p>
              </div>

              <div className="text-right flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span className="text-[11px] font-bold text-emerald-200 font-mono">Verified by Class Teacher & Principal</span>
              </div>
            </div>

          </div>
        );
      })()}

      {/* Apply for Pre-Planned Leave Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1b4d3e] flex items-center justify-center border border-emerald-200">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Apply for Pre-Planned Leave</h3>
            <p className="text-xs text-slate-500">
              Submit your leave application in advance so your teacher & principal are notified before attendance is marked.
            </p>
          </div>
        </div>

        <form onSubmit={handleLeaveSubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-[#1b4d3e]" />
                <span>Select Future Leave Date *</span>
              </label>
              <input
                type="date"
                required
                min={getTodayLocalDateStr()}
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Reason for Pre-Planned Absence *
              </label>
              <input
                type="text"
                required
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="e.g. Medical appointment, Family function, Official sports..."
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-200" />
            <span>Submit for Approval</span>
          </button>
        </form>

        {/* Submitted Leave Applications History */}
        {studentApps.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Your Leave Applications History
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {studentApps.map(app => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 border-slate-200"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        📅 {app.leaveDate}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Submitted: {app.submittedAt}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">"{app.reason}"</p>
                  </div>

                  <div>
                    {app.status === 'APPROVED' ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Approved by Principal</span>
                      </span>
                    ) : app.status === 'DECLINED' ? (
                      <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Declined: {app.declineReason || 'Not Approved'}</span>
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Pending Principal Approval</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Official Report Card Modal (WhatsApp Notice Hidden for Student) */}
      {showReportCard && (
        <StudentReportModal
          student={currentStudent}
          classId={studentClassId}
          hideWhatsApp={true}
          onClose={() => setShowReportCard(false)}
        />
      )}

    </div>
  );
}
