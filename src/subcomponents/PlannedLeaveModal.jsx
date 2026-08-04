import React from 'react';
import { CalendarCheck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function PlannedLeaveModal({ student, onConfirm, onCancel }) {
  React.useEffect(() => {
    window.scrollTo({ top: 50, behavior: 'smooth' });
  }, []);

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 md:pt-10 p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">Planned Leave Check</h3>
            <p className="text-xs text-slate-500">Confirm leave status for student</p>
          </div>
        </div>

        {/* Student Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex items-center space-x-4">
          <img
            src={student.photo}
            alt={student.name}
            className="w-14 h-14 rounded-xl object-cover border-2 border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#1b4d3e] text-white text-xs px-2 py-0.5 rounded-md font-mono font-bold">
                Roll #{student.rollNo}
              </span>
              <span className="text-xs text-slate-600 font-medium">{student.gender}</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-1">{student.name}</h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{student.parentPhone}</p>
          </div>
        </div>

        {/* Mandatory Prompt Question */}
        <div className="text-center mb-6">
          <p className="text-sm font-bold text-slate-900">
            Is <span className="text-[#1b4d3e] font-extrabold">{student.name}</span> on a <span className="text-amber-700 underline decoration-amber-500 underline-offset-4 font-black">PLANNED LEAVE</span> today?
          </p>
          {student.prePlannedLeave && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>Pre-applied leave on record: <strong>{student.leaveReason || 'Medical / Personal'}</strong></span>
            </div>
          )}
        </div>

        {/* Large Touch Action Buttons for YES / NO */}
        <div className="grid grid-cols-2 gap-4">
          {/* YES Button */}
          <button
            onClick={() => onConfirm(true)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg shadow-md active:scale-95 transition-all group cursor-pointer border border-amber-600"
          >
            <CheckCircle2 className="w-8 h-8 mb-1 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>YES</span>
            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Planned Leave</span>
          </button>

          {/* NO Button */}
          <button
            onClick={() => onConfirm(false)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-black text-lg shadow-md active:scale-95 transition-all group cursor-pointer border border-rose-600"
          >
            <XCircle className="w-8 h-8 mb-1 text-white group-hover:scale-110 transition-transform" />
            <span>NO</span>
            <span className="text-[10px] font-bold text-rose-100 uppercase tracking-wider">Unplanned Absence</span>
          </button>
        </div>

        {/* Cancel link */}
        <div className="mt-4 text-center">
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-900 font-semibold transition-colors underline cursor-pointer"
          >
            Cancel and Return
          </button>
        </div>

      </div>
    </div>
  );
}
