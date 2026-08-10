import React, { useState } from 'react';
import { X, Calendar, UserCheck, AlertCircle, Clock, CheckCircle2, ShieldCheck, Send, AlertTriangle, FileText } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function TeacherApplyLeaveModal({ teacher, onClose }) {
  const { classes, teacherLeaveRequests = [], submitTeacherLeaveRequest, showToast } = useAttendance();

  const teacherAssignedIds = teacher.assignedClasses || [];
  const teacherClasses = classes.filter(c => 
    teacherAssignedIds.includes(c.id) ||
    c.classTeacher === teacher.name || 
    c.teacherId === teacher.id
  );

  const [selectedClassId, setSelectedClassId] = useState(teacherClasses[0]?.id || classes[0]?.id || '');
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [durationPreset, setDurationPreset] = useState('1_day');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [leaveReason, setLeaveReason] = useState('');

  const handlePresetChange = (preset) => {
    setDurationPreset(preset);
    if (preset === '1_day') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === '2_days') {
      setStartDate(todayStr);
      setEndDate(tomorrowStr);
    }
  };

  // Find existing leave applications for THIS teacher
  const myLeaveRequests = teacherLeaveRequests.filter(r => 
    r.teacherId === teacher.id || r.teacherName === teacher.name
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!leaveReason.trim()) {
      showToast('Please provide a reason for leave application.', 'error');
      return;
    }

    const targetClass = classes.find(c => c.id === selectedClassId);

    submitTeacherLeaveRequest({
      teacherId: teacher.id || teacher.username,
      teacherName: teacher.name,
      leaveType,
      classId: selectedClassId,
      className: targetClass?.name || 'Class Section',
      startDate,
      endDate,
      durationLabel: durationPreset === '1_day' ? '1 Day (Today)' : durationPreset === '2_days' ? '2 Days (Today & Tomorrow)' : `${startDate} to ${endDate}`,
      reason: leaveReason
    });

    showToast(`Leave application submitted successfully! Pending approval from Principal.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up my-6">
        
        {/* Header */}
        <div className="bg-[#1b4d3e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-200 flex items-center justify-center border border-emerald-600 font-bold text-xl">
              📝
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md mb-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Faculty Leave Application</span>
              </div>
              <h3 className="text-base font-black text-white">Apply for Leave — {teacher.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 hover:bg-emerald-700 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Previous Applications History */}
          {myLeaveRequests.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-[#1b4d3e]" />
                <span>Your Leave Application History ({myLeaveRequests.length})</span>
              </span>

              <div className="space-y-2 pt-1">
                {myLeaveRequests.map(req => (
                  <div key={req.id} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{req.leaveType} — {req.className}</span>
                      <span className="text-[11px] text-slate-500">
                        {req.startDate} to {req.endDate} • {req.reason}
                      </span>
                    </div>

                    <div>
                      {req.status === 'APPROVED' ? (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>APPROVED</span>
                        </span>
                      ) : req.status === 'DECLINED' ? (
                        <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <X className="w-3 h-3 text-rose-700" />
                          <span>DECLINED</span>
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>PENDING APPROVAL</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Application Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-900">
              <AlertCircle className="w-4.5 h-4.5 text-[#1b4d3e] shrink-0 mt-0.5" />
              <span>
                Submitting this application sends a leave approval request directly to the Principal. Upon approval, the Principal will assign a substitute teacher to cover your class.
              </span>
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Select Leave Type *
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
              >
                <option value="Casual Leave">Casual Leave (CL)</option>
                <option value="Medical Leave">Medical Leave (ML)</option>
                <option value="Earned Leave">Earned Leave (EL)</option>
                <option value="Official Duty Leave">Official Duty Leave (OD)</option>
              </select>
            </div>

            {/* Class Section */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. Class Section Needing Coverage *
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
              >
                {teacherClasses.length > 0 ? (
                  teacherClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.shift})</option>
                  ))
                ) : (
                  classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.shift})</option>
                  ))
                )}
              </select>
            </div>

            {/* Duration Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                3. Leave Duration *
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetChange('1_day')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    durationPreset === '1_day'
                      ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  1 Day (Today)
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetChange('2_days')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    durationPreset === '2_days'
                      ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  2 Days (Today & Tomorrow)
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetChange('custom')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    durationPreset === 'custom'
                      ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Custom Range
                </button>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Start Date</span>
                  <input
                    type="date"
                    required
                    value={startDate}
                    disabled={durationPreset !== 'custom'}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">End Date</span>
                  <input
                    type="date"
                    required
                    value={endDate}
                    disabled={durationPreset !== 'custom'}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Leave Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                4. Reason for Leave *
              </label>
              <textarea
                required
                rows={3}
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Explain the reason for leave application..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
              />
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Send className="w-4 h-4 text-emerald-300" />
                <span>Submit Leave Application</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
