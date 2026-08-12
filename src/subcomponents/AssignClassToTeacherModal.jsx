import React, { useState } from 'react';
import { X, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function AssignClassToTeacherModal({ onClose }) {
  const { classes, teachers, assignClassTeacher, showToast } = useAttendance();

  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');

  // Available Teachers List
  const teacherOptions = teachers.map(t => {
    const assignedCount = (t.assignedClasses || []).length;
    return {
      id: t.id,
      name: t.name,
      username: t.username,
      assignedCount,
      avatar: t.avatar || '👨‍🏫',
      isAvailable: assignedCount < 2
    };
  });

  // Available Classes List
  const classOptions = classes.map(c => ({
    id: c.id,
    name: c.name,
    shift: c.shift || 'Morning Section',
    teacherName: c.classTeacher || c.teacherName || 'Unassigned'
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeacherId || !selectedClassId) {
      showToast('Please select both an available teacher and an available class section.', 'error');
      return;
    }

    const res = assignClassTeacher(selectedTeacherId, selectedClassId);
    if (res && res.success !== false) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="bg-[#1b4d3e] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 text-emerald-200 flex items-center justify-center border border-emerald-400/30">
              <UserCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Assign Class to Teacher</h3>
              <p className="text-xs text-emerald-200 font-medium">Assign available class section to an available teacher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800 flex items-center justify-center transition-all cursor-pointer border border-emerald-400/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Dropdown 1: Select Available Teacher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Select Available Teacher *</span>
              <span className="text-[10px] text-slate-400 font-normal">({teacherOptions.length} Teachers Onboarded)</span>
            </label>
            <select
              required
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
            >
              <option value="">-- Choose Available Teacher --</option>
              {teacherOptions.map(t => (
                <option key={t.id} value={t.id}>
                  {t.avatar} {t.name} ({t.username || t.id}) — Assigned: {t.assignedCount}/2 Classes {t.isAvailable ? '✅ (Available)' : '⚠️ (Max 2 reached)'}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 2: Select Available Class */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Select Available Class Section *</span>
              <span className="text-[10px] text-slate-400 font-normal">({classOptions.length} Sections Active)</span>
            </label>
            <select
              required
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
            >
              <option value="">-- Choose Available Class Section --</option>
              {classOptions.map(c => (
                <option key={c.id} value={c.id}>
                  🏫 {c.name} ({c.shift}) — Current Teacher: {c.teacherName}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedTeacherId || !selectedClassId}
              className="px-5 py-2.5 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Assign Class to Teacher</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
