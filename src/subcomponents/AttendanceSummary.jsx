import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, XCircle, Calendar, RefreshCw, UserCheck, Lock } from 'lucide-react';

export default function AttendanceSummary({ classInfo, markedRecords, studentList = [], submissionStatus = 'NOT_SUBMITTED', onBackToDeck, onConfirmSubmit, onSubmit }) {
  const [records, setRecords] = useState(markedRecords);

  const totalClassStudents = Math.min(15, studentList.length > 0 ? studentList.length : 15);
  const isAttendanceComplete = records.length >= totalClassStudents;
  const isLocked = (submissionStatus === 'PENDING_APPROVAL' || submissionStatus === 'APPROVED') && submissionStatus !== 'DECLINED';

  const presentCount = records.filter(r => r.status === 'present').length;
  const absentRecords = records.filter(r => r.status === 'absent');
  const plannedLeaveCount = absentRecords.filter(r => r.plannedLeave).length;

  // Toggle student status directly from summary table
  const handleToggleStatus = (rollNo) => {
    if (isLocked) return;
    setRecords(prev =>
      prev.map(r => {
        if (r.rollNo === rollNo) {
          const newStatus = r.status === 'absent' ? 'present' : 'absent';
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  // Toggle planned leave YES/NO directly from summary table
  const handleTogglePlannedLeave = (rollNo) => {
    if (isLocked) return;
    setRecords(prev =>
      prev.map(r => {
        if (r.rollNo === rollNo) {
          return { ...r, plannedLeave: !r.plannedLeave };
        }
        return r;
      })
    );
  };

  const handleFinalSubmit = () => {
    if (isLocked || !isAttendanceComplete) return;
    const submitFn = onConfirmSubmit || onSubmit;
    if (submitFn) {
      submitFn(records);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Summary Header */}
      <div className="bg-[#1b4d3e] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-800/80 text-emerald-100 text-xs px-3 py-1 rounded-full border border-emerald-400/30 font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Attendance Review & Cross-Check</span>
            </div>
            <h2 className="text-2xl font-black text-white">{classInfo.name} Summary</h2>
            <p className="text-xs text-emerald-100/90">Verify absent list before submitting to Principal for approval</p>
          </div>

          {/* Quick Stats pill */}
          <div className="grid grid-cols-3 gap-2 bg-[#143c30] p-3 rounded-2xl border border-emerald-600/40 text-center">
            <div>
              <div className="text-base font-black text-emerald-300">{presentCount}</div>
              <div className="text-[10px] text-emerald-100 font-semibold uppercase">Present</div>
            </div>
            <div className="border-x border-emerald-700 px-2">
              <div className="text-base font-black text-rose-300">{absentRecords.length}</div>
              <div className="text-[10px] text-emerald-100 font-semibold uppercase">Absent</div>
            </div>
            <div>
              <div className="text-base font-black text-amber-300">{plannedLeaveCount}</div>
              <div className="text-[10px] text-emerald-100 font-semibold uppercase">Leave</div>
            </div>
          </div>
        </div>
      </div>

      {/* Incomplete Attendance Alert Banner */}
      {!isAttendanceComplete && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-3xl text-amber-900 text-xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <span className="text-lg">⚠️</span>
            <div>
              <span className="font-extrabold text-amber-950 text-sm block">Attendance Incomplete</span>
              <span>
                Only <strong>{records.length} / {totalClassStudents}</strong> students have been marked. You must mark attendance for all {totalClassStudents} students before submitting to the Principal.
              </span>
            </div>
          </div>
          <button
            onClick={() => onBackToDeck(records)}
            className="px-3.5 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            Mark Remaining ({totalClassStudents - records.length})
          </button>
        </div>
      )}

      {/* Absent Students Cross-Check Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
            <XCircle className="w-5 h-5" />
            <span>List of Absent Students ({absentRecords.length})</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Click any button to adjust status</span>
        </div>

        {absentRecords.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-2">
            <UserCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-emerald-900">100% Attendance Recorded!</h4>
            <p className="text-xs text-emerald-700">All students in {classInfo.name} are present today.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {absentRecords.map(student => (
              <div
                key={student.rollNo}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#1b4d3e] bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                        Roll #{student.rollNo}
                      </span>
                      <span className="text-xs text-slate-500">{student.gender}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{student.name}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">{student.parentPhone}</span>
                  </div>
                </div>

                {/* Right controls: Planned Leave badge + Toggle button */}
                <div className="flex items-center space-x-3">
                  {/* Planned Leave Toggle */}
                  {!isLocked && (
                    <button
                      onClick={() => handleTogglePlannedLeave(student.rollNo)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border cursor-pointer ${
                        student.plannedLeave
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}
                      title="Click to toggle planned leave status"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Planned Leave: <strong>{student.plannedLeave ? 'YES' : 'NO'}</strong></span>
                    </button>
                  )}

                  {/* Change to Present Button */}
                  {!isLocked && (
                    <button
                      onClick={() => handleToggleStatus(student.rollNo)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-[#1b4d3e] hover:bg-[#1b4d3e] hover:text-white border border-emerald-300 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Mark Present</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions Bar (BACK & SUBMIT) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-3xl shadow-md">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => onBackToDeck(records)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK (Edit / Change Missed Student)</span>
        </button>

        {/* SUBMIT FOR APPROVAL BUTTON */}
        <button
          onClick={handleFinalSubmit}
          disabled={isLocked || !isAttendanceComplete}
          className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-md transition-all ${
            isLocked || !isAttendanceComplete
              ? 'bg-slate-200 border border-slate-300 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#1b4d3e] hover:bg-[#143c30] text-white cursor-pointer active:scale-95'
          }`}
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4 text-slate-400" />
              <span>SUBMISSION LOCKED ({submissionStatus === 'APPROVED' ? 'APPROVED' : 'PENDING APPROVAL'})</span>
            </>
          ) : !isAttendanceComplete ? (
            <>
              <span>MARK ALL {totalClassStudents} STUDENTS TO SUBMIT ({records.length}/{totalClassStudents})</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-emerald-200" />
              <span>SUBMIT FOR PRINCIPAL APPROVAL</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
}
