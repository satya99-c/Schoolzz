import React, { useState } from 'react';
import PlannedLeaveModal from './PlannedLeaveModal';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, UserCheck, AlertTriangle, ShieldCheck, Check, RefreshCw, Lock } from 'lucide-react';

export default function AttendanceDeck({
  classInfo,
  studentList,
  initialMarkedRecords = [],
  submissionStatus = 'NOT_SUBMITTED',
  declineReason = '',
  onFinish,
  onBackToClassSelect
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [markedRecords, setMarkedRecords] = useState(initialMarkedRecords);
  const [pendingAbsentStudent, setPendingAbsentStudent] = useState(null);
  const [editingRollNo, setEditingRollNo] = useState(null);

  // Sync state when switching classes
  React.useEffect(() => {
    setCurrentIndex(0);
    setMarkedRecords(initialMarkedRecords);
    setPendingAbsentStudent(null);
    setEditingRollNo(null);
  }, [classInfo.id, initialMarkedRecords]);

  const currentStudent = studentList[currentIndex];

  // Helper to find if student was already marked
  const getExistingMark = (rollNo) => {
    return markedRecords.find(r => r.rollNo === rollNo);
  };

  // Mark Present
  const handleMarkPresent = () => {
    const updated = markedRecords.filter(r => r.rollNo !== currentStudent.rollNo);
    const newRecord = {
      rollNo: currentStudent.rollNo,
      name: currentStudent.name,
      gender: currentStudent.gender,
      parentPhone: currentStudent.parentPhone,
      photo: currentStudent.photo,
      status: 'present',
      plannedLeave: false
    };
    const nextList = [...updated, newRecord];
    setMarkedRecords(nextList);
    setEditingRollNo(null);

    // Auto advance
    if (currentIndex < studentList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all students!
      onFinish(nextList);
    }
  };

  // Trigger Absent click -> Opens Planned Leave Modal
  const handleAbsentClick = () => {
    setPendingAbsentStudent(currentStudent);
  };

  // Confirm Planned Leave YES or NO
  const handlePlannedLeaveDecision = (isPlanned) => {
    const updated = markedRecords.filter(r => r.rollNo !== currentStudent.rollNo);
    const newRecord = {
      rollNo: currentStudent.rollNo,
      name: currentStudent.name,
      gender: currentStudent.gender,
      parentPhone: currentStudent.parentPhone,
      photo: currentStudent.photo,
      status: 'absent',
      plannedLeave: isPlanned
    };
    const nextList = [...updated, newRecord];
    setMarkedRecords(nextList);
    setPendingAbsentStudent(null);
    setEditingRollNo(null);

    // Auto advance
    if (currentIndex < studentList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all students!
      onFinish(nextList);
    }
  };

  const progressPercent = Math.round((markedRecords.length / studentList.length) * 100);

  const existingMark = currentStudent ? getExistingMark(currentStudent.rollNo) : null;
  const isPresentSelected = existingMark?.status === 'present';
  const isAbsentSelected = existingMark?.status === 'absent';
  const isEditing = editingRollNo === currentStudent?.rollNo;

  // Status is locked if submitted (Pending or Approved), UNLESS Principal declined it
  const isLocked = (submissionStatus === 'PENDING_APPROVAL' || submissionStatus === 'APPROVED') && submissionStatus !== 'DECLINED';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-3xl shadow-md">
        <button
          onClick={onBackToClassSelect}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors bg-slate-100 px-3 py-2 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Attendance</span>
        </button>

        <div className="text-center">
          <h2 className="text-base font-bold text-slate-900 leading-tight">{classInfo.name} ({classInfo.shift})</h2>
          <div className="text-xs text-[#1b4d3e] font-bold flex items-center justify-center space-x-1.5 mt-1">
            <span>Attendance Deck</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700 font-mono font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-[#1b4d3e] text-xs font-mono font-bold px-3 py-1.5 rounded-xl">
          {currentIndex + 1} / {studentList.length}
        </div>
      </div>

      {/* Lock or Decline Alert Banner */}
      {submissionStatus === 'DECLINED' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 animate-bounce" />
            <div>
              <span className="font-bold text-rose-900">Attendance Declined by Principal:</span>
              <p className="text-[11px] text-rose-800 mt-0.5 font-mono">"{declineReason || 'Principal requested changes'}"</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Status editing is unlocked. Please revise student statuses and re-submit.</p>
            </div>
          </div>
        </div>
      )}

      {isLocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-center space-x-2.5 shadow-sm">
          <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            Attendance is locked after submission. To change a student's status, <strong>Principal must decline the approval</strong>.
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1.5 px-1">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Overall Progress ({markedRecords.length} / {studentList.length} Marked)</span>
          <span className="text-[#1b4d3e] font-mono font-bold">{progressPercent}%</span>
        </div>
        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-[#1b4d3e] rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Student Focus Card (Styled in Slightly Lighter Website Green) */}
      {currentStudent && (
        <div className="relative bg-[#256350] border border-emerald-400/40 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden text-center space-y-6 text-white">
          
          {/* Roll Number Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-300/40 text-emerald-100 px-4 py-1.5 rounded-2xl shadow-inner">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Roll Number</span>
            <span className="text-xl font-black font-mono text-white">#{currentStudent.rollNo}</span>
          </div>

          {/* Avatar & Photo */}
          <div className="relative inline-block">
            <img
              src={currentStudent.photo}
              alt={currentStudent.name}
              className="w-32 h-32 md:w-36 md:h-36 rounded-3xl object-cover border-4 border-emerald-700 shadow-2xl mx-auto ring-4 ring-emerald-300/30"
            />
            <span className={`absolute -bottom-2 right-2 px-3 py-1 rounded-full text-[11px] font-bold shadow-md border ${
              currentStudent.gender === 'Male'
                ? 'bg-sky-950 text-sky-200 border-sky-400/50'
                : 'bg-pink-950 text-pink-200 border-pink-400/50'
            }`}>
              {currentStudent.gender}
            </span>
          </div>

          {/* Name & Details */}
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {currentStudent.name}
            </h3>
            <p className="text-xs text-emerald-100/90 font-mono mt-1">
              Parent Contact: {currentStudent.parentPhone}
            </p>
          </div>

          {/* Pre-applied leave notification banner if applicable */}
          {currentStudent.prePlannedLeave && (
            <div className={`rounded-2xl p-3.5 text-xs flex items-center justify-center space-x-2 border shadow-sm ${
              currentStudent.leaveStatus === 'APPROVED'
                ? 'bg-emerald-800/90 border-emerald-400 text-white'
                : 'bg-amber-500/20 border-amber-300/50 text-amber-100 animate-pulse'
            }`}>
              {currentStudent.leaveStatus === 'APPROVED' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-300" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-300" />
              )}
              <div className="text-center">
                {currentStudent.leaveStatus === 'APPROVED' ? (
                  <div>
                    <span className="font-extrabold text-emerald-200 uppercase tracking-wide">✓ Pre-Planned Leave Approved by Principal!</span>
                    <p className="text-[11px] text-white mt-0.5">Date: {currentStudent.leaveDate || 'Upcoming'} • Reason: "{currentStudent.leaveReason}"</p>
                  </div>
                ) : (
                  <span>Student has a pre-applied planned leave: <strong>{currentStudent.leaveReason}</strong> (Pending Principal Approval)</span>
                )}
              </div>
            </div>
          )}

          {/* TOUCH BUTTONS DISPLAY SECTION */}
          <div className="pt-4 border-t border-emerald-400/30">
            
            {/* SCENARIO 1: PRESENT SELECTED (COMPLETELY OCCUPIES FULL WIDTH) */}
            {isPresentSelected && !isEditing && (
              <div className="space-y-3 animate-fade-in">
                <div className="w-full py-6 px-6 rounded-3xl bg-[#10b981] text-white font-black text-2xl md:text-3xl shadow-xl flex items-center justify-center space-x-3 border-2 border-emerald-300">
                  <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  <span>PRESENT</span>
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-100 px-2 pt-1">
                  <span className="text-emerald-200 font-bold">✓ Marked as Present</span>
                  {!isLocked ? (
                    <button
                      onClick={() => setEditingRollNo(currentStudent.rollNo)}
                      className="text-emerald-100 hover:text-white underline font-medium flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Change Status to Absent</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-200/70 font-medium flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked (Principal approval pending)</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* SCENARIO 2: ABSENT SELECTED (COMPLETELY OCCUPIES FULL WIDTH) */}
            {isAbsentSelected && !isEditing && (
              <div className="space-y-3 animate-fade-in">
                <div className="w-full py-6 px-6 rounded-3xl bg-[#ef4444] text-white font-black text-2xl md:text-3xl shadow-xl flex items-center justify-center space-x-3 border-2 border-rose-300">
                  <XCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  <span>ABSENT ({existingMark.plannedLeave ? 'PLANNED LEAVE' : 'UNPLANNED'})</span>
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-100 px-2 pt-1">
                  <span className="text-rose-200 font-bold">✕ Marked as Absent ({existingMark.plannedLeave ? 'Planned Leave' : 'Unplanned'})</span>
                  {!isLocked ? (
                    <button
                      onClick={() => setEditingRollNo(currentStudent.rollNo)}
                      className="text-emerald-100 hover:text-white underline font-medium flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Change Status to Present</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-200/70 font-medium flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked (Principal approval pending)</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* SCENARIO 3: UNMARKED / EDITING MODE (LARGE TOUCH BUTTONS) */}
            {(!existingMark || isEditing) && (
              <div className="grid grid-cols-2 gap-4">
                {/* LARGE ABSENT BUTTON (LEFT) */}
                <button
                  onClick={handleAbsentClick}
                  disabled={isLocked}
                  className="group relative overflow-hidden py-8 px-4 rounded-3xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-extrabold text-xl md:text-2xl shadow-lg transition-all duration-200 transform active:scale-95 border-2 border-rose-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <XCircle className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:scale-110 transition-transform" />
                    <span>ABSENT</span>
                    <span className="text-[10px] font-medium text-rose-100 uppercase tracking-widest">Opens Leave Check</span>
                  </div>
                </button>

                {/* LARGE PRESENT BUTTON (RIGHT) */}
                <button
                  onClick={handleMarkPresent}
                  disabled={isLocked}
                  className="group relative overflow-hidden py-8 px-4 rounded-3xl bg-[#10b981] hover:bg-[#059669] text-white font-extrabold text-xl md:text-2xl shadow-lg transition-all duration-200 transform active:scale-95 border-2 border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:scale-110 transition-transform" />
                    <span>PRESENT</span>
                    <span className="text-[10px] font-medium text-emerald-100 uppercase tracking-widest">Tap to mark</span>
                  </div>
                </button>
              </div>
            )}

          </div>

          {/* Navigation Arrows for Previous / Next & Small Submit Button */}
          <div className="flex items-center justify-between pt-3 border-t border-emerald-400/30 text-xs gap-2">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="flex items-center space-x-1 text-emerald-100 hover:text-white disabled:opacity-40 disabled:hover:text-emerald-100 font-bold px-2.5 py-1.5 rounded-xl hover:bg-emerald-700/50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Student</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentIndex(Math.min(studentList.length - 1, currentIndex + 1))}
                disabled={currentIndex === studentList.length - 1}
                className="flex items-center space-x-1 text-emerald-100 hover:text-white disabled:opacity-40 disabled:hover:text-emerald-100 font-bold px-2.5 py-1.5 rounded-xl hover:bg-emerald-700/50 transition-all cursor-pointer"
              >
                <span>Next Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {markedRecords.length > 0 && (
                <button
                  onClick={() => onFinish(markedRecords)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-[#1b4d3e] font-extrabold text-xs shadow-md flex items-center space-x-1 transition-all cursor-pointer active:scale-95 border border-emerald-200"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#1b4d3e]" />
                  <span>Submit</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* PLANNED LEAVE DECISION MODAL */}
      {pendingAbsentStudent && (
        <PlannedLeaveModal
          student={pendingAbsentStudent}
          onConfirm={(isPlanned) => handlePlannedLeaveDecision(isPlanned)}
          onCancel={() => setPendingAbsentStudent(null)}
        />
      )}

    </div>
  );
}
