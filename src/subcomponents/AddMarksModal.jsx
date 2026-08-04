import React, { useState } from 'react';
import { X, Award, CheckCircle2, BookOpen, Save, FileText, AlertCircle } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function AddMarksModal({ student, classId, initialExamName, existingRecord, onClose }) {
  const { saveStudentMarks } = useAttendance();

  const [examName, setExamName] = useState(existingRecord?.examName || initialExamName || 'Mid-Term Examination 2026');
  const [remarks, setRemarks] = useState(existingRecord?.remarks || '');

  const [subjects, setSubjects] = useState({
    Mathematics: existingRecord?.subjects?.Mathematics ?? '',
    Science: existingRecord?.subjects?.Science ?? '',
    English: existingRecord?.subjects?.English ?? '',
    SocialStudies: existingRecord?.subjects?.SocialStudies ?? '',
    Physics: existingRecord?.subjects?.Physics ?? ''
  });

  const handleSubjectChange = (subjectKey, value) => {
    const numVal = Math.min(100, Math.max(0, Number(value) || 0));
    setSubjects(prev => ({
      ...prev,
      [subjectKey]: numVal
    }));
  };

  const math = Number(subjects.Mathematics || 0);
  const sci = Number(subjects.Science || 0);
  const eng = Number(subjects.English || 0);
  const ss = Number(subjects.SocialStudies || 0);
  const phy = Number(subjects.Physics || 0);

  const totalMarks = math + sci + eng + ss + phy;
  const maxMarks = 500;
  const percentage = Math.round((totalMarks / maxMarks) * 1000) / 10;

  // Grade is calculated strictly from total percentage got
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 33) grade = 'D';

  // Pass Criteria: If ANY subject is < 35, student is FAILED!
  const hasFailedSubject = math < 35 || sci < 35 || eng < 35 || ss < 35 || phy < 35;
  const status = hasFailedSubject ? 'FAILED' : 'PASSED';

  const handleSubmit = (e) => {
    e.preventDefault();
    saveStudentMarks({
      classId,
      rollNo: student.rollNo,
      studentName: student.name,
      examName,
      subjects,
      remarks
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 z-50 overflow-y-auto pt-6 md:pt-10">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="bg-[#1b4d3e] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={student.photo}
              alt={student.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-300 shadow-md"
            />
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-emerald-800/80 text-emerald-100 text-[10px] px-2.5 py-0.5 rounded-full font-semibold mb-0.5">
                <Award className="w-3 h-3 text-emerald-300" />
                <span>Roll #{student.rollNo} • Marks Entry</span>
              </div>
              <h2 className="text-lg font-black text-white">{student.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          
          {/* Exam Name Field (Non-Editable) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Examination Name
            </label>
            <input
              type="text"
              readOnly
              value={examName}
              className="w-full bg-slate-100 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-700 font-bold focus:outline-none cursor-not-allowed shadow-inner"
            />
          </div>

          {/* Subject Marks Grid */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Subject Marks (Out of 100)</span>
              <span className="text-[10px] text-slate-400 font-mono">Max: 100 Each</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span>📐 Mathematics</span>
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subjects.Mathematics}
                  onChange={(e) => handleSubjectChange('Mathematics', e.target.value)}
                  className="w-16 bg-white border border-slate-300 rounded-lg p-1.5 text-center text-xs font-mono font-bold text-[#1b4d3e] focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span>🔬 Science</span>
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subjects.Science}
                  onChange={(e) => handleSubjectChange('Science', e.target.value)}
                  className="w-16 bg-white border border-slate-300 rounded-lg p-1.5 text-center text-xs font-mono font-bold text-[#1b4d3e] focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span>📖 English</span>
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subjects.English}
                  onChange={(e) => handleSubjectChange('English', e.target.value)}
                  className="w-16 bg-white border border-slate-300 rounded-lg p-1.5 text-center text-xs font-mono font-bold text-[#1b4d3e] focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span>🌍 Social Studies</span>
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subjects.SocialStudies}
                  onChange={(e) => handleSubjectChange('SocialStudies', e.target.value)}
                  className="w-16 bg-white border border-slate-300 rounded-lg p-1.5 text-center text-xs font-mono font-bold text-[#1b4d3e] focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between sm:col-span-2">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span>⚡ Physics</span>
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subjects.Physics}
                  onChange={(e) => handleSubjectChange('Physics', e.target.value)}
                  className="w-16 bg-white border border-slate-300 rounded-lg p-1.5 text-center text-xs font-mono font-bold text-[#1b4d3e] focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>
            </div>
          </div>

          {/* Live Scorecard Preview Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Calculated Total</div>
              <div className="text-xl font-black text-[#1b4d3e] font-mono mt-0.5">
                {totalMarks} / {maxMarks} <span className="text-xs font-bold text-emerald-700">({percentage}%)</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-xs font-black px-3 py-1 rounded-full border font-mono ${
                status === 'PASSED' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}>
                Grade: {grade} • {status}
              </span>
            </div>
          </div>

          {/* Remarks Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Teacher Remarks / Feedback
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Excellent conceptual clarity, Keep working hard..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-200" />
              <span>Submit Marks</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
