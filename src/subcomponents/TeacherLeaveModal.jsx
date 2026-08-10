import React, { useState } from 'react';
import { X, Calendar, UserCheck, AlertCircle, Clock, CheckCircle2, ShieldCheck, RefreshCw, Trash2 } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function TeacherLeaveModal({ teacher, onClose }) {
  const { classes, teachers, substituteAssignments = [], assignSubstituteTeacher, cancelSubstituteAssignment, showToast } = useAttendance();

  // Selected Class to Cover (default to teacher's first assigned class or class teacher class)
  const teacherClasses = classes.filter(c => 
    c.classTeacher === teacher.name || 
    (teacher.assignedClasses || []).includes(c.id) ||
    c.teacherId === teacher.id
  );

  const [selectedClassId, setSelectedClassId] = useState(teacherClasses[0]?.id || classes[0]?.id || '');
  
  // Available Substitute Teachers (excluding the teacher on leave)
  const availableSubstitutes = teachers.filter(t => t.id !== teacher.id && (t.role === 'teacher' || !t.role));
  const [substituteTeacherId, setSubstituteTeacherId] = useState(availableSubstitutes[0]?.id || '');

  // Duration selection: '1_day' | '2_days' | 'custom'
  const [durationPreset, setDurationPreset] = useState('1_day');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [leaveReason, setLeaveReason] = useState('Personal / Medical Leave');

  // Handle Preset Change
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

  // Find active substitute assignments for this teacher
  const activeAssignmentsForTeacher = substituteAssignments.filter(a => a.leaveTeacherId === teacher.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClassId || !substituteTeacherId) {
      showToast('Please select a class and substitute teacher.', 'error');
      return;
    }

    const subTeacher = teachers.find(t => t.id === substituteTeacherId);
    const targetClass = classes.find(c => c.id === selectedClassId);

    assignSubstituteTeacher({
      leaveTeacherId: teacher.id,
      leaveTeacherName: teacher.name,
      substituteTeacherId,
      substituteTeacherName: subTeacher?.name || 'Substitute Teacher',
      classId: selectedClassId,
      className: targetClass?.name || 'Class Section',
      startDate,
      endDate,
      durationLabel: durationPreset === '1_day' ? '1 Day (Today)' : durationPreset === '2_days' ? '2 Days (Today & Tomorrow)' : `${startDate} to ${endDate}`,
      reason: leaveReason
    });

    showToast(`Leave assigned to ${teacher.name}! ${subTeacher?.name} assigned as Substitute for ${targetClass?.name} (${startDate} to ${endDate}).`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up my-6">
        
        {/* Header */}
        <div className="bg-[#1b4d3e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-200 flex items-center justify-center border border-emerald-600 font-bold text-xl">
              {teacher.avatar || '👨‍🏫'}
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md mb-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Temporary Leave & Substitute Coverage</span>
              </div>
              <h3 className="text-base font-black text-white">{teacher.name} — Leave Management</h3>
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
          
          {/* Active Leave Assignments Banner */}
          {activeAssignmentsForTeacher.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Active Substitute Assignments ({activeAssignmentsForTeacher.length})</span>
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {activeAssignmentsForTeacher.map(assign => (
                  <div key={assign.id} className="bg-white border border-amber-200 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{assign.className}</span>
                      <span className="text-[11px] text-amber-900">
                        Covered by <strong>{assign.substituteTeacherName}</strong> ({assign.startDate} to {assign.endDate})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        cancelSubstituteAssignment(assign.id);
                        showToast(`Substitute assignment for ${assign.className} cancelled.`, 'info');
                      }}
                      className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Revert</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-900">
              <AlertCircle className="w-4.5 h-4.5 text-[#1b4d3e] shrink-0 mt-0.5" />
              <span>
                <strong>Substitute Policy:</strong> When a teacher is on leave for 1 or 2 days, the assigned substitute teacher will gain access to take attendance and manage scores for that class during the leave period.
              </span>
            </div>

            {/* Class Section Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Select Class Section to Cover *
              </label>
              <select
                required
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.shift}) — Primary: {c.classTeacher || teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Substitute Teacher Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. Select Available Substitute Teacher *
              </label>
              <select
                required
                value={substituteTeacherId}
                onChange={(e) => setSubstituteTeacherId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
              >
                {availableSubstitutes.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Username: {t.username}) — Available Faculty
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Presets (1 Day, 2 Days, Custom) */}
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

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                4. Leave Reason / Notes
              </label>
              <input
                type="text"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="e.g. Medical Leave, Casual Leave, Conference"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
              />
            </div>

            {/* Buttons */}
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
                <UserCheck className="w-4 h-4 text-emerald-300" />
                <span>Confirm & Assign Substitute</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
