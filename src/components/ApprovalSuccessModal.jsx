import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { CheckCircle2, ShieldCheck, MessageSquare, Phone, X, CheckCheck, Send } from 'lucide-react';

export default function ApprovalSuccessModal() {
  const { approvalModalData, setApprovalModalData } = useAttendance();

  if (!approvalModalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl shadow-emerald-950/50 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setApprovalModalData(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10 cursor-pointer border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Banner */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 p-6 md:p-8 border-b border-slate-800 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-3 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approved by Principal</span>
            </div>
            <h2 className="text-2xl font-black text-white">Attendance Approved!</h2>
            <p className="text-xs text-slate-400 mt-1">
              Class <strong className="text-emerald-400">{approvalModalData.classId}</strong> attendance record has been finalized.
            </p>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Metrics Row */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
            <div>
              <div className="text-base font-bold text-white">{approvalModalData.stats?.present || 0}</div>
              <div className="text-[10px] text-emerald-400 font-semibold uppercase">Present</div>
            </div>
            <div>
              <div className="text-base font-bold text-rose-400">{approvalModalData.stats?.absent || 0}</div>
              <div className="text-[10px] text-rose-400 font-semibold uppercase">Absent</div>
            </div>
            <div>
              <div className="text-base font-bold text-sky-400">{approvalModalData.notifiedStudents?.length || 0}</div>
              <div className="text-[10px] text-sky-400 font-semibold uppercase">SMS Sent</div>
            </div>
          </div>

          {/* WHATSAPP ALERTS SENT BANNER & LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Parent Alerts Sent</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                {approvalModalData.notifiedStudents?.length || 0} Delivered
              </span>
            </div>

            {approvalModalData.notifiedStudents?.length === 0 ? (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                All absent students had prior planned leave. No parent SMS dispatches required.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {approvalModalData.notifiedStudents.map(st => (
                  <div
                    key={st.id}
                    className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-2xl space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Roll #{st.rollNo} {st.studentName}</span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sent to Parent</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Phone: {st.parentPhone}</span>
                      <span className="text-[10px] text-slate-500">{st.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setApprovalModalData(null)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            OK / Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
