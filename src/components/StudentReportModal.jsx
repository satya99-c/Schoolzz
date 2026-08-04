import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Calendar, Phone, User, Award, Send, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function StudentReportModal({ student, className = 'Class 10-A', hideWhatsApp = false, onClose }) {
  const { showToast, setActiveWhatsAppPreview } = useAttendance();

  React.useEffect(() => {
    window.scrollTo({ top: 50, behavior: 'smooth' });
  }, []);

  if (!student) return null;

  // 3-Month Term Calculation
  const validPct = Number.isFinite(student.attendancePct) ? student.attendancePct : 90;
  const totalTermDays = 75; // 3 Months (June, July, August)
  const termPresentDays = Math.round((validPct / 100) * totalTermDays);
  const termLeaveDays = student.daysLeave || 1.5;
  const termAbsentDays = Math.max(0, totalTermDays - termPresentDays - termLeaveDays);
  const calculatedAttendancePct = Math.round((termPresentDays / totalTermDays) * 100);

  const isEligibleForExam = calculatedAttendancePct >= 80;

  // 3-Month Breakdown Data
  const monthlyBreakdown = [
    {
      month: 'June 2026 (Month 1)',
      present: Math.min(25, Math.round(termPresentDays * 0.34)),
      leave: 0.5,
      absent: 1.5,
      pct: Math.min(100, Math.round(calculatedAttendancePct * 0.98))
    },
    {
      month: 'July 2026 (Month 2)',
      present: Math.min(26, Math.round(termPresentDays * 0.35)),
      leave: 0.5,
      absent: 1,
      pct: Math.min(100, Math.round(calculatedAttendancePct * 1.02))
    },
    {
      month: 'August 2026 (Month 3 - Current)',
      present: student.daysPresent || 23,
      leave: student.daysLeave || 0.5,
      absent: student.daysAbsent || 1.5,
      pct: student.attendancePct
    }
  ];

  // 30-Day Calendar Days Visual Grid
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    let status = 'present';
    if (calculatedAttendancePct < 85 && (i === 4 || i === 12 || i === 19 || i === 25)) {
      status = 'absent';
    } else if (i === 8 || i === 22) {
      status = 'leave';
    } else if (i % 7 === 5 || i % 7 === 6) {
      status = 'weekend';
    }

    return { day: dayNum, status };
  });

  const handleSendNotice = () => {
    const waLog = {
      id: `wa-term-${Date.now()}`,
      studentName: student.name,
      rollNo: student.rollNo,
      classId: className,
      parentPhone: student.parentPhone,
      message: `Dear Parent, Roll #${student.rollNo} ${student.name}'s 3-Month Term Attendance is ${calculatedAttendancePct}% (${termPresentDays}/${totalTermDays} days present). ${
        isEligibleForExam
          ? 'Student is in GOOD STANDING for examinations (>80%).'
          : 'WARNING: Attendance shortage below 80%. Please contact school administration.'
      }`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Sent to WhatsApp',
      acknowledged: false
    };

    setActiveWhatsAppPreview(waLog);
    showToast(`3-Month Attendance Summary sent to parent WhatsApp (${student.parentPhone})!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 md:pt-10 p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all z-10 cursor-pointer border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="p-5 sm:p-6 pb-4 bg-[#1b4d3e] text-white rounded-t-3xl space-y-1">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 text-emerald-100 text-xs px-3 py-1 rounded-full border border-emerald-400/30 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Student 3-Month Attendance Overview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{student.name} — Attendance Record</h2>
          <p className="text-xs text-emerald-100/90">Calculated on 3-month term cycle (June 1 - August 31, 2026)</p>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Profile Header & Attendance % Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl gap-4">
            <div className="flex items-center space-x-3.5">
              <img
                src={student.photo}
                alt={student.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#1b4d3e] text-white text-xs px-2.5 py-0.5 rounded-md font-mono font-bold">
                    Roll #{student.rollNo}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{student.gender}</span>
                </div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 mt-1">{student.name}</h3>
                <div className="text-xs text-slate-500 font-mono">Parent Contact: {student.parentPhone}</div>
              </div>
            </div>

            {/* 3-Month Term Attendance % Badge */}
            <div className={`p-3.5 sm:p-4 rounded-2xl text-center shadow-sm min-w-[130px] w-full sm:w-auto border ${
              calculatedAttendancePct >= 80
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-rose-50 border-rose-300'
            }`}>
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">3-Month Term</div>
              <div className={`text-2xl sm:text-3xl font-black font-mono mt-0.5 ${
                calculatedAttendancePct >= 80 ? 'text-[#1b4d3e]' : 'text-rose-600'
              }`}>
                {calculatedAttendancePct}%
              </div>
              <div className={`text-[10px] font-extrabold uppercase mt-0.5 ${
                calculatedAttendancePct >= 80 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                Attendance %
              </div>
            </div>
          </div>

          {/* 3-Month Term Quick Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Total Term Days</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">{totalTermDays} Days</div>
              <div className="text-[10px] text-slate-400">June – August</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Days Attended</div>
              <div className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5">{termPresentDays} Days</div>
              <div className="text-[10px] text-emerald-700 font-semibold">Classes Attended</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Approved Leave</div>
              <div className="text-lg sm:text-xl font-black text-amber-600 mt-0.5">{termLeaveDays} Days</div>
              <div className="text-[10px] text-amber-700 font-semibold">Prior Leave</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Unplanned Absence</div>
              <div className="text-lg sm:text-xl font-black text-rose-600 mt-0.5">{termAbsentDays} Days</div>
              <div className="text-[10px] text-rose-700 font-semibold">Absent Shortage</div>
            </div>
          </div>

          {/* Examination Eligibility Alert Banner */}
          <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
            isEligibleForExam
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {isEligibleForExam ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-extrabold text-sm block">
                {isEligibleForExam ? '✓ Examination Eligible (Good Standing)' : '⚠️ Attendance Shortage Warning'}
              </span>
              <p className="text-xs mt-0.5">
                {isEligibleForExam
                  ? `Student has maintained ${calculatedAttendancePct}% attendance (above the required 80% examination threshold).`
                  : `Attendance Shortage Warning: Student attendance is ${calculatedAttendancePct}%, which is below the mandatory 80% examination threshold.`}
              </p>
            </div>
          </div>

          {/* 3-Month Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">3-Month Term Breakdown</h4>
            <div className="border border-slate-200 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[480px]">
                <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Month Cycle</th>
                    <th className="p-3">Present Days</th>
                    <th className="p-3">Planned Leave</th>
                    <th className="p-3">Unplanned Absent</th>
                    <th className="p-3 text-right">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {monthlyBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{row.month}</td>
                      <td className="p-3 font-mono text-emerald-700 font-bold">{row.present} Days</td>
                      <td className="p-3 font-mono text-amber-700 font-bold">{row.leave} Days</td>
                      <td className="p-3 font-mono text-rose-700 font-bold">{row.absent} Days</td>
                      <td className={`p-3 text-right font-mono font-bold ${row.pct >= 80 ? 'text-[#1b4d3e]' : 'text-rose-600'}`}>{row.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 30-Day Attendance Grid Calendar */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">30-Day Attendance Activity</h4>
              <div className="flex items-center space-x-2.5 text-[11px] font-semibold text-slate-600 flex-wrap">
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span><span>Present</span></span>
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span><span>Leave</span></span>
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span><span>Absent</span></span>
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span><span>Off</span></span>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              {calendarDays.map((item) => (
                <div
                  key={item.day}
                  className={`p-1.5 rounded-xl text-center font-mono border transition-all flex flex-col justify-center items-center min-h-[44px] ${
                    item.status === 'present'
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300/80 shadow-2xs'
                      : item.status === 'leave'
                      ? 'bg-amber-100 text-amber-950 border-amber-300/80 shadow-2xs'
                      : item.status === 'absent'
                      ? 'bg-rose-100 text-rose-950 border-rose-300/80 shadow-2xs'
                      : 'bg-slate-200/80 text-slate-600 border-slate-300'
                  }`}
                >
                  <div className="text-[11px] font-black text-slate-900 leading-tight">Day {item.day}</div>
                  <div className="text-[9px] font-extrabold uppercase mt-0.5 tracking-tight">
                    {item.status === 'present' ? 'Present' : item.status === 'leave' ? 'Leave' : item.status === 'absent' ? 'Absent' : 'Off'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct WhatsApp Notice Action (Only for Faculty & Principal) */}
          {!hideWhatsApp && (
            <div className="pt-2">
              <button
                onClick={handleSendNotice}
                className="w-full py-3 px-4 rounded-2xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-200" />
                <span>Send 3-Month Attendance Summary to Parent WhatsApp</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
