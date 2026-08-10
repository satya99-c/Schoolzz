import React, { useState } from 'react';
import { Award, BookOpen, CheckCircle2, XCircle, Search, Edit, FileText, Sparkles, Filter, ChevronDown, User } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';
import AddMarksModal from './AddMarksModal';

export default function AcademicScorecardManager({ userRole = 'teacher', targetClassId }) {
  const { classes, students, studentMarks, currentUser } = useAttendance();

  // Selected Exam Term & Class Scope
  const teacherClassId = currentUser?.classTeacherClassId || targetClassId || currentUser?.assignedClasses?.[0];
  const [selectedExamTerm, setSelectedExamTerm] = useState('Mid-Term Examination 2026');
  const [selectedClassId, setSelectedClassId] = useState(
    userRole === 'teacher' ? (teacherClassId || classes[0]?.id) : (targetClassId || classes[0]?.id)
  );
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isAllClasses = selectedClassId === 'all';
  const activeClassObj = isAllClasses ? { name: 'All Classes (All Sections)' } : (classes.find(c => c.id === selectedClassId) || classes[0]);

  // Gather student list (All Classes vs Single Class)
  let classStudentList = [];
  if (isAllClasses) {
    const allStMap = {};
    classes.forEach(c => {
      (students[c.id] || []).forEach(st => {
        const key = `${c.name}_${st.rollNo}`;
        if (!allStMap[key]) {
          allStMap[key] = { ...st, className: c.name, classId: c.id };
        }
      });
    });
    classStudentList = Object.values(allStMap);
  } else {
    classStudentList = (students[selectedClassId] || []).map(st => ({
      ...st,
      className: classes.find(c => c.id === selectedClassId)?.name || ''
    }));
  }

  // Filter students based on search
  const filteredStudents = classStudentList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(s.rollNo).includes(searchQuery) ||
    (s.className && s.className.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Computed metrics for current selected class or all classes
  let classMarksList = [];
  if (isAllClasses) {
    Object.values(studentMarks).forEach(mList => {
      (mList || []).filter(m => m.examName === selectedExamTerm).forEach(m => classMarksList.push(m));
    });
  } else {
    classMarksList = (studentMarks[selectedClassId] || []).filter(m => m.examName === selectedExamTerm);
  }

  const totalEvaluated = classMarksList.length;
  const passedCount = classMarksList.filter(m => m.status === 'PASSED').length;
  const failedCount = classMarksList.filter(m => m.status === 'FAILED').length;
  const passPct = totalEvaluated > 0 ? Math.round((passedCount / totalEvaluated) * 100) : 100;

  // Highest score in class
  const topScorer = classMarksList.reduce((max, curr) => (curr.totalMarks > (max?.totalMarks || 0) ? curr : max), null);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1b4d3e] to-[#256854] text-white p-6 rounded-3xl shadow-lg border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-emerald-400/30 flex items-center justify-center text-emerald-200 shadow-inner">
            <Award className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-800/80 text-emerald-100 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1 border border-emerald-400/20">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>Academic Year Scorecards & Exam Performance</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              {userRole === 'teacher' ? `Class Scorecard — ${activeClassObj?.name || 'Assigned Class'}` : 'Academic Scorecards Overview'}
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
              Subject Breakdown • Total 500 Marks • Automatic Grade & Pass/Fail Status
            </p>
          </div>
        </div>

        {/* Controls: Exam Term & Class Select */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {userRole === 'principal' && (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-white/10 text-white border border-emerald-400/30 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:bg-emerald-950/80 cursor-pointer"
            >
              <option value="all" className="text-slate-900 font-bold">🌟 All Classes (All Sections)</option>
              {Array.from(new Set(classes.map(c => c.name))).map(className => {
                const cObj = classes.find(c => c.name === className);
                return (
                  <option key={cObj.id} value={cObj.id} className="text-slate-900 font-semibold">
                    {className}
                  </option>
                );
              })}
            </select>
          )}

          <select
            value={selectedExamTerm}
            onChange={(e) => setSelectedExamTerm(e.target.value)}
            className="bg-white/10 text-white border border-emerald-400/30 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:bg-emerald-950/80"
          >
            <option value="Mid-Term Examination 2026" className="text-slate-900 font-semibold">Mid-Term Exam 2026</option>
            <option value="Annual Examination 2026" className="text-slate-900 font-semibold">Annual Exam 2026</option>
            <option value="Formative Assessment FA-1" className="text-slate-900 font-semibold">Formative Assessment (FA-1)</option>
          </select>
        </div>
      </div>

      {/* Class Statistics Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Students</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{classStudentList.length}</div>
          <div className="text-[10px] text-slate-400 font-medium">Evaluated: {totalEvaluated}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase">Passed Students</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{passedCount}</div>
          <div className="text-[10px] text-emerald-800 font-medium">Pass Rate: {passPct}%</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-rose-700 uppercase">Needs Attention</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{failedCount}</div>
          <div className="text-[10px] text-rose-800 font-medium">Subject Failure</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase">Top Performer</div>
          <div className="text-sm font-black text-amber-900 truncate mt-1">
            {topScorer ? topScorer.studentName : 'Pending Entry'}
          </div>
          <div className="text-[10px] text-amber-800 font-medium">
            {topScorer ? `${topScorer.percentage}% (${topScorer.grade})` : 'Max Score: 500'}
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-[#1b4d3e] font-black">{filteredStudents.length}</span> students for {activeClassObj?.name}
        </div>
      </div>

      {/* Student Scorecards Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Roll #</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4 text-center">Math</th>
                <th className="py-3.5 px-4 text-center">Science</th>
                <th className="py-3.5 px-4 text-center">English</th>
                <th className="py-3.5 px-4 text-center">Social</th>
                <th className="py-3.5 px-4 text-center">Physics</th>
                <th className="py-3.5 px-4 text-center">Total / 500</th>
                <th className="py-3.5 px-4 text-center">% & Grade</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                {userRole === 'teacher' && <th className="py-3.5 px-4 text-right">Action</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((st) => {
                const marksRec = (studentMarks[selectedClassId] || []).find(
                  m => m.rollNo === st.rollNo && m.examName === selectedExamTerm
                );

                const subs = marksRec?.subjects || { Mathematics: 85, Science: 80, English: 90, SocialStudies: 88, Physics: 82 };
                const totalMarks = marksRec?.totalMarks || 425;
                const pct = marksRec?.percentage || 85;
                const grade = marksRec?.grade || 'A';
                const status = marksRec?.status || 'PASSED';

                return (
                  <tr key={st.rollNo} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">#{st.rollNo}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img src={st.photo} alt={st.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <div className="font-extrabold text-slate-900">{st.name}</div>
                          <div className="text-[10px] text-slate-400">{st.gender}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{subs.Mathematics}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{subs.Science}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{subs.English}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{subs.SocialStudies}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{subs.Physics}</td>

                    <td className="py-3.5 px-4 text-center font-black text-[#1b4d3e]">{totalMarks} / 500</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-extrabold text-slate-900">{pct}%</span>
                      <span className="ml-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {grade}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {status === 'PASSED' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>PASSED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>FAILED</span>
                        </span>
                      )}
                    </td>

                    {userRole === 'teacher' && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setEditingStudent({ student: st, record: marksRec })}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-[#1b4d3e] text-[#1b4d3e] hover:text-white border border-emerald-300 rounded-xl font-bold text-xs transition-all cursor-pointer inline-flex items-center space-x-1 shadow-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Scorecard</span>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Marks Modal */}
      {editingStudent && (
        <AddMarksModal
          student={editingStudent.student}
          classId={selectedClassId}
          initialExamName={selectedExamTerm}
          existingRecord={editingStudent.record}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </div>
  );
}
