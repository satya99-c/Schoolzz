import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { X, CheckCheck, Phone, Video, MoreVertical, Send, ShieldCheck, Smartphone } from 'lucide-react';

export default function WhatsAppModal() {
  const { activeWhatsAppPreview, setActiveWhatsAppPreview, whatsappLogs } = useAttendance();

  if (!activeWhatsAppPreview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/50 flex flex-col h-[580px]">
        
        {/* WhatsApp Top Green Header */}
        <div className="bg-emerald-700 text-white p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-400/40 flex items-center justify-center font-bold text-sm text-emerald-200">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h4 className="font-bold text-sm leading-tight">Schoolzz Parent Alert</h4>
              <p className="text-[11px] text-emerald-100/80 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Official WhatsApp Automation</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-emerald-100">
            <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
            <Video className="w-4 h-4 cursor-pointer hover:text-white" />
            <button
              onClick={() => setActiveWhatsAppPreview(null)}
              className="p-1 rounded-full hover:bg-emerald-800 text-white transition-all ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contact Info Sub-bar */}
        <div className="bg-slate-800/90 px-4 py-2 text-xs border-b border-slate-700/60 flex justify-between items-center text-slate-300">
          <div>
            <span className="text-slate-400">Recipient: </span>
            <span className="font-semibold text-emerald-400">{activeWhatsAppPreview.parentPhone}</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-medium">
            Class {activeWhatsAppPreview.classId}
          </span>
        </div>

        {/* WhatsApp Chat Body */}
        <div 
          className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/90"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 80%)`
          }}
        >
          {/* Date separator */}
          <div className="flex justify-center">
            <span className="bg-slate-800 text-slate-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-semibold border border-slate-700/50">
              Today
            </span>
          </div>

          {/* Incoming Automated WhatsApp Card */}
          <div className="max-w-[85%] bg-emerald-950/90 border border-emerald-500/40 text-emerald-100 p-3.5 rounded-2xl rounded-tl-none shadow-md space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-1 text-[11px] font-semibold text-emerald-400">
              <span>AUTOMATED ABSENCE ALERT</span>
              <span className="text-[10px] text-emerald-300/70">{activeWhatsAppPreview.timestamp}</span>
            </div>

            <p className="text-xs leading-relaxed font-medium">
              {activeWhatsAppPreview.message}
            </p>

            <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-300">
              <span className="font-semibold">Student: {activeWhatsAppPreview.studentName} (Roll #{activeWhatsAppPreview.rollNo})</span>
              <CheckCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Simulated Parent Acknowledgment Bubble */}
          <div className="max-w-[80%] ml-auto bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tr-none border border-slate-700 shadow-md">
            <p className="text-xs">Acknowledged by Parent. Thank you for the notification.</p>
            <div className="flex justify-end items-center space-x-1 mt-1 text-[10px] text-slate-400">
              <span>{activeWhatsAppPreview.timestamp}</span>
              <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
            </div>
          </div>

          {/* Quick Select another Log if available */}
          {whatsappLogs.length > 1 && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">Other Sent WhatsApp Notifications:</p>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {whatsappLogs.map(log => (
                  <button
                    key={log.id}
                    onClick={() => setActiveWhatsAppPreview(log)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex justify-between items-center transition-all ${
                      log.id === activeWhatsAppPreview.id
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">Roll #{log.rollNo} - {log.studentName}</span>
                    <span className="text-[10px] font-mono opacity-80">{log.parentPhone}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Simulated Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value="Simulated parent response field..."
            className="flex-1 bg-slate-950 text-slate-500 text-xs px-3 py-2 rounded-xl border border-slate-800 cursor-not-allowed"
          />
          <div className="p-2 rounded-xl bg-emerald-600 text-white">
            <Send className="w-4 h-4" />
          </div>
        </div>

      </div>
    </div>
  );
}
