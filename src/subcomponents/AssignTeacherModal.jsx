import React, { useState } from 'react';
import { X, UserCheck, School, AlertCircle } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function AssignTeacherModal({ teacher, onClose }) {
  const { classes, assignClassTeacher } = useAttendance();
  const [selectedClassId, setSelectedClassId] = useState(teacher.classTeacherClassId || teacher.assignedClasses?.[0] || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClassId) return;
    assignClassTeacher(teacher.id, selectedClassId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="bg-[#1b4d3e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{teacher.avatar || '👨‍🏫'}</span>
            <div>
              <h3 className="text-base font-extrabold text-white">{teacher.name}</h3>
              <p className="text-xs text-emerald-200 font-medium">Assign Class Teacher (Scorecards & Exam Marks)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-start space-x-2 text-xs text-emerald-900">
            <AlertCircle className="w-4 h-4 text-[#1b4d3e] shrink-0 mt-0.5" />
            <span>
              <strong>Class Teacher Policy:</strong> Assigning a teacher as Class Teacher allows them to enter and edit Academic Exam Marks & Scorecards for that class section.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Class Section *
            </label>
            <select
              required
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e] font-semibold"
            >
              <option value="">-- Select Class Section --</option>
              {classes.map(c => {
                const currentTeacher = c.classTeacher || 'Unassigned';
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.shift}) — Current Class Teacher: {currentTeacher}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedClassId}
              className="px-5 py-2 bg-[#1b4d3e] text-white text-xs font-bold rounded-xl hover:bg-[#143a2f] disabled:opacity-50 transition-all cursor-pointer flex items-center space-x-1.5 shadow-md"
            >
              <UserCheck className="w-4 h-4" />
              <span>Confirm Class Teacher Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
