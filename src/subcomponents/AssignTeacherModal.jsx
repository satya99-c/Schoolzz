import React, { useState } from 'react';
import { X, UserCheck, AlertCircle } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function AssignTeacherModal({ teacher, onClose }) {
  const { classes, teachers, assignClassTeacher } = useAttendance();
  const [selectedClassId, setSelectedClassId] = useState(teacher.classTeacherClassId || teacher.assignedClasses?.[0] || '');

  // Group classes by unique class name (e.g. "Class 10 - Section A")
  const uniqueClassNames = Array.from(new Set(classes.map(c => c.name)));

  // Filter available classes: show only unassigned classes OR the class currently assigned to THIS teacher
  const availableClassOptions = uniqueClassNames.map(className => {
    const shiftClasses = classes.filter(c => c.name === className);
    const primaryClass = shiftClasses[0];

    // Find if another teacher is assigned as Class Teacher for this class name
    const assignedTeacherObj = teachers.find(t =>
      t.classTeacherClassId && shiftClasses.some(c => c.id === t.classTeacherClassId)
    );

    const isAssignedToThisTeacher = assignedTeacherObj?.id === teacher.id;
    const isAssignedToOther = assignedTeacherObj && !isAssignedToThisTeacher;
    const currentTeacherName = assignedTeacherObj ? assignedTeacherObj.name : 'Unassigned';

    return {
      id: primaryClass.id,
      name: className,
      currentTeacherName,
      isAssignedToThisTeacher,
      isAssignedToOther
    };
  }).filter(opt => !opt.isAssignedToOther); // REMAINING AVAILABLE CLASSES ONLY!

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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Class *
            </label>
            <select
              required
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e] font-semibold cursor-pointer"
            >
              <option value="">-- Select Class --</option>
              {availableClassOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.name} {opt.isAssignedToThisTeacher ? `(Currently Assigned: ${teacher.name})` : '— Available'}
                </option>
              ))}
            </select>
            {availableClassOptions.length === 0 && (
              <p className="text-[11px] text-rose-600 font-bold mt-1">
                ⚠️ All classes have already been assigned to Class Teachers.
              </p>
            )}
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
              className="px-4 py-2 bg-[#1b4d3e] text-white text-xs font-bold rounded-xl hover:bg-[#143c30] shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>Assign Class Teacher</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
