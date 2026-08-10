import React, { useState, useEffect } from 'react';
import { X, Calendar, UserCheck, AlertCircle, Clock, CheckCircle2, ShieldCheck, RefreshCw, Trash2, AlertTriangle, Check } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function TeacherLeaveModal({ teacher, onClose }) {
  const { classes, teachers, substituteAssignments = [], assignSubstituteTeacher, cancelSubstituteAssignment, showToast } = useAttendance();

  // RULE 1: Filter ONLY attendance classes assigned to THIS respective teacher (e.g. Mr. Sharma)
  const teacherAssignedIds = teacher.assignedClasses || [];
  const teacherClasses = classes.filter(c => teacherAssignedIds.includes(c.id));

  // Deduplicate by class ID
  const uniqueTeacherClasses = Array.from(new Set(teacherClasses.map(c => c.id)))
    .map(id => teacherClasses.find(c => c.id === id));

  const [selectedClassId, setSelectedClassId] = useState(uniqueTeacherClasses[0]?.id || '');
  
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

  // RULE 2: Calculate Substitute Teacher Availability based on Shift & Occupancy Max 2
  const targetClassObj = classes.find(c => c.id === selectedClassId) || uniqueTeacherClasses[0];
  const targetShiftType = targetClassObj?.shift?.toLowerCase().includes('morning') ? 'Morning' : 'Afternoon';

  const substituteCandidates = teachers.map(t => {
    // Cannot substitute for self
    if (t.id === teacher.id || t.username === teacher.username || t.name === teacher.name) {
      return { ...t, available: false, reason: 'Teacher on Leave' };
    }

    // Must be a teacher
    if (t.role && t.role !== 'teacher') {
      return { ...t, available: false, reason: 'Not a Teacher' };
    }

    // Get primary assigned classes for candidate teacher t
    const tAssignedIds = t.assignedClasses || [];
    const tAssignedClasses = classes.filter(c => tAssignedIds.includes(c.id));

    // Get active substitute assignments for teacher t overlapping date range
    const tSubAssignments = substituteAssignments.filter(a => 
      (a.substituteTeacherId === t.id || a.substituteTeacherName === t.name) &&
      !(new Date(a.endDate) < new Date(startDate) || new Date(a.startDate) > new Date(endDate))
    );

    const tSubClassIds = tSubAssignments.map(a => a.classId);
    const tSubClasses = classes.filter(c => tSubClassIds.includes(c.id));

    const allOccupiedClasses = [...tAssignedClasses, ...tSubClasses];

    // Occupancy Rule: Max 2 classes
    if (allOccupiedClasses.length >= 2) {
      return { ...t, available: false, reason: `Occupied (${allOccupiedClasses.length}/2 Classes Assigned)` };
    }

    // Shift Conflict Rule: Check if already teaching/marking in targetShiftType ('Morning' or 'Afternoon')
    const isBusyInShift = allOccupiedClasses.some(c => 
      c.shift?.toLowerCase().includes(targetShiftType.toLowerCase())
    );

    if (isBusyInShift) {
      return { ...t, available: false, reason: `Occupied in ${targetShiftType} Section` };
    }

    return { ...t, available: true, reason: `Available for ${targetShiftType} Section` };
  });

  const availableSubstitutes = substituteCandidates.filter(t => t.available);
  const unavailableSubstitutes = substituteCandidates.filter(t => !t.available);

  const [substituteTeacherId, setSubstituteTeacherId] = useState(availableSubstitutes[0]?.id || '');

  // Keep substituteTeacherId synced with available teachers
  useEffect(() => {
    if (availableSubstitutes.length > 0) {
      if (!availableSubstitutes.some(t => t.id === substituteTeacherId)) {
        setSubstituteTeacherId(availableSubstitutes[0].id);
      }
    } else {
      setSubstituteTeacherId('');
    }
  }, [selectedClassId, startDate, endDate, substituteAssignments, teachers]);

  // Find active substitute assignments for this teacher
  const activeAssignmentsForTeacher = substituteAssignments.filter(a => a.leaveTeacherId === teacher.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      showToast('Please select an assigned class to cover.', 'error');
      return;
    }

    if (!substituteTeacherId) {
      showToast(`No available substitute teachers for ${targetShiftType} Section!`, 'error');
      return;
    }

    const subTeacher = teachers.find(t => t.id === substituteTeacherId);

    assignSubstituteTeacher({
      leaveTeacherId: teacher.id,
      leaveTeacherName: teacher.name,
      substituteTeacherId,
      substituteTeacherName: subTeacher?.name || 'Substitute Teacher',
      classId: selectedClassId,
      className: targetClassObj?.name || 'Class Section',
      startDate,
      endDate,
      durationLabel: durationPreset === '1_day' ? '1 Day (Today)' : durationPreset === '2_days' ? '2 Days (Today & Tomorrow)' : `${startDate} to ${endDate}`,
      reason: leaveReason
    });

    showToast(`Leave assigned to ${teacher.name}! ${subTeacher?.name} assigned as Substitute for ${targetClassObj?.name} (${startDate} to ${endDate}).`, 'success');
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
            {/* 1. Class Section Selection (Only assigned attendance classes for respective teacher) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Select Class Section to Cover *
              </label>
              {uniqueTeacherClasses.length > 0 ? (
                <select
                  required
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
                >
                  {uniqueTeacherClasses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.shift}) — Shift: {c.shift.includes('Morning') ? '🌅 Morning' : '🌆 Afternoon'}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold">
                  ⚠️ {teacher.name} currently has no assigned class sections to cover.
                </div>
              )}
            </div>

            {/* 2. Substitute Teacher Selection (Shift Availability & Max 2 Occupancy filter) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  2. Select Available Substitute Teacher ({targetShiftType} Section) *
                </label>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Required Shift: {targetShiftType}
                </span>
              </div>

              <select
                required
                value={substituteTeacherId}
                onChange={(e) => setSubstituteTeacherId(e.target.value)}
                disabled={availableSubstitutes.length === 0}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e] cursor-pointer disabled:opacity-60"
              >
                {availableSubstitutes.length > 0 ? (
                  <optgroup label={`Available Faculty for ${targetShiftType} Section`}>
                    {availableSubstitutes.map(t => (
                      <option key={t.id} value={t.id}>
                        ✓ {t.name} ({t.username}) — {t.reason}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  <option value="">-- No Available Substitute Teachers for {targetShiftType} Section --</option>
                )}

                {unavailableSubstitutes.length > 0 && (
                  <optgroup label="Unavailable / Occupied Faculty">
                    {unavailableSubstitutes.map(t => (
                      <option key={t.id} value={t.id} disabled>
                        ✕ {t.name} ({t.username}) — {t.reason}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {availableSubstitutes.length === 0 && (
                <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    No substitute teachers are available for the <strong>{targetShiftType} Section</strong>. All other teachers are either already occupied in the {targetShiftType} Section or assigned 2 classes.
                  </span>
                </div>
              )}
            </div>

            {/* 3. Duration Presets (1 Day, 2 Days, Custom) */}
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

            {/* 4. Leave Reason / Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                4. Leave Reason / Notes
              </label>
              <input
                type="text"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="e.g. Medical Leave, Casual Leave, Official Duty"
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
                disabled={uniqueTeacherClasses.length === 0 || availableSubstitutes.length === 0}
                className="px-5 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
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
