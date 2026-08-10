import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { getTodayLocalDateStr } from '../utils/dateUtils';
import AttendanceDeck from '../subcomponents/AttendanceDeck';
import AttendanceSummary from '../subcomponents/AttendanceSummary';
import TeacherReports from '../subcomponents/TeacherReports';
import AddMarksModal from '../subcomponents/AddMarksModal';
import { School, Play, CheckCircle2, Clock, Users, UserCheck, ChevronRight, BarChart3, Sun, Moon, Award, BookOpen, FileCheck, ArrowLeft, PlusCircle, FileText, Calendar, CreditCard, Send, Download, Search } from 'lucide-react';

export default function TeacherPortal() {
  const { classes, students, activeClassId, setActiveClassId, submitTeacherAttendance, submissions, currentUser, studentMarks, studentFees = {}, examRosters = [], createExamRoster, showToast } = useAttendance();

  // Top Section Navigation: 'attendance' | 'reports' | 'marks'
  const [activeTab, setActiveTab] = useState('attendance');

  // Mode inside Attendance: 'class_select' | 'deck' | 'summary' | 'submitted_success'
  const [mode, setMode] = useState('class_select');
  const [currentMarkedRecords, setCurrentMarkedRecords] = useState([]);

  // Marks & Fee Entry state
  const [selectedMarksClassId, setSelectedMarksClassId] = useState(null);
  const [selectedFeeClassId, setSelectedFeeClassId] = useState(null);
  const [feeSearchQuery, setFeeSearchQuery] = useState('');
  const [feeStatusFilter, setFeeStatusFilter] = useState('all');
  const [selectedStudentForMarks, setSelectedStudentForMarks] = useState(null);
  const [selectedExamName, setSelectedExamName] = useState('Mid-Term Examination 2026');
  const [showCreateRosterModal, setShowCreateRosterModal] = useState(false);
  const [newExamNameInput, setNewExamNameInput] = useState('');

  // All Present Confirmation Modal state
  const [showAllPresentModal, setShowAllPresentModal] = useState(false);
  const [pendingStartClassId, setPendingStartClassId] = useState(null);

  // Filter classes assigned to THIS teacher
  const assignedIds = currentUser?.assignedClasses || ['10-A_morning', '10-B_afternoon'];
  const assignedClasses = classes.filter(c => assignedIds.includes(c.id));

  const activeClassObj = classes.find(c => c.id === activeClassId) || assignedClasses[0] || classes[0];
  const activeStudentList = students[activeClassId] || [];

  const dateStr = getTodayLocalDateStr();

  const handleStartAttendance = (classId) => {
    setActiveClassId(classId);
    const existingSub = submissions[`${classId}_${dateStr}`];
    
    if (existingSub && existingSub.records && existingSub.records.length > 0) {
      // Review / Retake: Open Attendance Deck card view directly
      setCurrentMarkedRecords(existingSub.records);
      setMode('deck');
      return;
    }

    // Start fresh attendance: open confirmation popup modal
    setPendingStartClassId(classId);
    setShowAllPresentModal(true);
  };

  const handleConfirmAllPresent = () => {
    if (!pendingStartClassId) return;
    setActiveClassId(pendingStartClassId);
    const targetStudents = students[pendingStartClassId] || [];
    const allPresentRecords = targetStudents.map(st => ({
      rollNo: st.rollNo,
      name: st.name,
      gender: st.gender,
      parentPhone: st.parentPhone,
      photo: st.photo,
      status: 'present',
      plannedLeave: false
    }));
    setCurrentMarkedRecords(allPresentRecords);
    setMode('summary');
    setShowAllPresentModal(false);
  };

  const handleStartIndividualDeck = () => {
    if (!pendingStartClassId) return;
    setActiveClassId(pendingStartClassId);
    setCurrentMarkedRecords([]);
    setMode('deck');
    setShowAllPresentModal(false);
  };

  const handleFinishDeck = (markedRecords) => {
    setCurrentMarkedRecords(markedRecords);
    setMode('summary');
  };

  const handleBackToDeck = (updatedRecords) => {
    setCurrentMarkedRecords(updatedRecords);
    setMode('deck');
  };

  const handleFinalSubmit = (finalRecords) => {
    submitTeacherAttendance(activeClassId, finalRecords);
    setMode('submitted_success');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Tab Selector: Take Attendance VS Reports VS Exam Marks */}
      <div className="flex flex-col sm:flex-row bg-white p-1.5 rounded-2xl border border-slate-200 gap-1.5 shadow-sm">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Daily Attendance Marking</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Attendance Performance Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('marks')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeTab === 'marks'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Academic Exam Marks & Scorecards</span>
        </button>
      </div>

      {/* TAB 1: DAILY ATTENDANCE MARKING */}
      {activeTab === 'attendance' && (
        <>
          {/* MODE 1: CLASS SELECTION GRID */}
          {mode === 'class_select' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Banner */}
              <div className="bg-[#1b4d3e] text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center space-x-2 bg-emerald-800/80 text-emerald-100 text-xs px-3 py-1 rounded-full border border-emerald-400/30 font-semibold mb-3">
                    <UserCheck className="w-4 h-4" />
                    <span>Assigned Classes for {currentUser?.name}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">Class Attendance Center</h1>
                  <p className="text-sm text-emerald-100/90 mt-1">Select your assigned morning or afternoon section to begin attendance.</p>
                </div>
              </div>

              {/* Classes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignedClasses.map(cls => {
                  const clsStudents = students[cls.id] || [];
                  const sub = submissions[`${cls.id}_${dateStr}`];
                  const isSubmitted = Boolean(sub);

                  return (
                    <div
                      key={cls.id}
                      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="text-xs font-bold text-[#1b4d3e] bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full inline-block shadow-sm">
                              {cls.name}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100/90 border border-slate-200 px-3 py-1 rounded-full inline-flex items-center space-x-1.5 font-mono shadow-2xs">
                              <Calendar className="w-3.5 h-3.5 text-[#1b4d3e]" />
                              <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </span>
                          </div>
                          
                          {/* Shift Badge */}
                          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1">
                            {cls.shift.includes('Morning') ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                            <span>{cls.shift}</span>
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 font-medium flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cls.shiftTime}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{clsStudents.length} Students</span>
                          </span>
                        </div>
                      </div>

                      {/* Status & Action */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Today's Status</div>
                          {isSubmitted ? (
                            <span className={`text-xs font-bold ${
                              sub.status === 'APPROVED' ? 'text-emerald-600' : sub.status === 'DECLINED' ? 'text-rose-600' : 'text-amber-600'
                            }`}>
                              {sub.status === 'APPROVED' ? '✓ APPROVED' : sub.status === 'DECLINED' ? '✕ DECLINED' : '⏳ PENDING APPROVAL'}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-slate-500">NOT MARKED YET</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleStartAttendance(cls.id)}
                          className="px-5 py-2.5 rounded-2xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                        >
                          <span>{isSubmitted ? 'Review / Retake' : 'Start Attendance'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* AUTOMATED ATTENDANCE REMINDERS SCHEDULE & ALERT LOG */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Automated Attendance Reminders Schedule</h3>
                      <p className="text-xs text-slate-500">System automatically fires reminders if class attendance is not submitted on time</p>
                    </div>
                  </div>
                  <span className="bg-[#1b4d3e] text-white text-xs font-mono font-bold px-3 py-1 rounded-full">
                    Active System Rules
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* MORNING SESSION REMINDERS CARD */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <span className="text-xs font-extrabold text-[#1b4d3e] uppercase tracking-wider">
                        🌅 Morning Session (08:00 AM Start)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        3 Tier Alerts
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                        <span className="font-semibold text-slate-800">🔔 Reminder 1:</span>
                        <span className="font-mono font-bold text-emerald-700">08:10 AM</span>
                        <span className="text-[10px] text-slate-500">10 mins grace</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                        <span className="font-semibold text-slate-800">⚠️ Reminder 2:</span>
                        <span className="font-mono font-bold text-amber-700">08:30 AM</span>
                        <span className="text-[10px] text-slate-500">30 mins grace</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                        <span className="font-semibold text-slate-800">🚨 Reminder 3:</span>
                        <span className="font-mono font-bold text-rose-700">09:00 AM</span>
                        <span className="text-[10px] text-rose-600 font-bold">60 mins (Overdue)</span>
                      </div>
                    </div>
                  </div>

                  {/* AFTERNOON SESSION REMINDERS CARD */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                        🌇 Afternoon Session (12:30 PM Start)
                      </span>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                        3 Tier Alerts
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                        <span className="font-semibold text-slate-800">🔔 Reminder 1:</span>
                        <span className="font-mono font-bold text-amber-700">12:40 PM</span>
                        <span className="text-[10px] text-slate-500">10 mins grace</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                        <span className="font-semibold text-slate-800">⚠️ Reminder 2:</span>
                        <span className="font-mono font-bold text-amber-800">01:00 PM</span>
                        <span className="text-[10px] text-slate-500">30 mins grace</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                        <span className="font-semibold text-slate-800">🚨 Reminder 3:</span>
                        <span className="font-mono font-bold text-rose-700">01:30 PM</span>
                        <span className="text-[10px] text-rose-600 font-bold">60 mins (Overdue)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* MODE 2: TOUCH ATTENDANCE DECK */}
          {mode === 'deck' && (
            <AttendanceDeck
              classInfo={activeClassObj}
              studentList={activeStudentList}
              initialMarkedRecords={currentMarkedRecords.length > 0 ? currentMarkedRecords : submissions[`${activeClassId}_${dateStr}`]?.records || []}
              submissionStatus={submissions[`${activeClassId}_${dateStr}`]?.status || 'NOT_SUBMITTED'}
              declineReason={submissions[`${activeClassId}_${dateStr}`]?.declineReason || ''}
              onFinish={handleFinishDeck}
              onBackToClassSelect={() => setMode('class_select')}
            />
          )}

          {/* MODE 3: REVIEWS & SUMMARY BEFORE SUBMIT */}
          {mode === 'summary' && (
            <AttendanceSummary
              classInfo={activeClassObj}
              markedRecords={currentMarkedRecords}
              studentList={activeStudentList}
              submissionStatus={submissions[`${activeClassId}_${dateStr}`]?.status || 'NOT_SUBMITTED'}
              onBackToDeck={handleBackToDeck}
              onConfirmSubmit={handleFinalSubmit}
            />
          )}

          {/* MODE 4: SUBMITTED SUCCESS SCREEN */}
          {mode === 'submitted_success' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4 shadow-xl animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Attendance Submitted!</h2>
              <p className="text-xs text-slate-600">
                Attendance for <span className="font-bold text-[#1b4d3e]">{activeClassObj.name} ({activeClassObj.shift})</span> has been submitted to the Principal for review & approval.
              </p>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setMode('class_select')}
                  className="w-full py-3 rounded-2xl bg-[#1b4d3e] text-white font-bold text-xs shadow-md hover:bg-[#143c30] transition-all"
                >
                  Return to Class Selection
                </button>
              </div>
            </div>
          )}

          {/* ALL STUDENTS PRESENT PROMPT MODAL */}
          {showAllPresentModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up text-center">
                
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#1b4d3e] flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-md">
                  <UserCheck className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900">Are all students present today?</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Class: <span className="font-extrabold text-[#1b4d3e]">{classes.find(c => c.id === pendingStartClassId)?.name}</span> ({(students[pendingStartClassId] || []).length} Students enrolled)
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-left space-y-1">
                  <span className="text-[11px] font-bold text-emerald-900 block">💡 Quick Attendance Options:</span>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    • Click <strong>"Yes"</strong> to mark all {(students[pendingStartClassId] || []).length} students as <strong>PRESENT</strong> & proceed directly to approval review.
                    <br />
                    • Click <strong>"No"</strong> to mark students individually starting from Roll #1.
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleStartIndividualDeck}
                    className="flex-1 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 text-xs font-black hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                  >
                    No, Take Roll #1
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAllPresent}
                    className="flex-1 py-3 rounded-2xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-black shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-emerald-600"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Yes, All Present</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </>
      )}

      {/* TAB 2: PERFORMANCE REPORTS */}
      {activeTab === 'reports' && <TeacherReports />}

      {/* TAB 3: ACADEMIC EXAM SCORECARDS & MARKS ENTRY */}
      {activeTab === 'marks' && (() => {
        // Scoped ONLY to the current class section assigned to currentUser as Class Teacher by Principal!
        const activeClassTeacherClassId = currentUser?.classTeacherClassId;
        const activeClassName = activeClassTeacherClassId 
          ? classes.find(c => c.id === activeClassTeacherClassId)?.name 
          : null;

        const teacherClassList = classes.filter(c => {
          if (activeClassName) {
            return c.name === activeClassName;
          }
          if (activeClassTeacherClassId) {
            return c.id === activeClassTeacherClassId;
          }
          return c.classTeacher === currentUser?.name || c.teacherId === currentUser?.id;
        });

        // Deduplicate by class name (e.g. Class 10 - Section B)
        const uniqueClassTeacherClasses = Array.from(new Set(teacherClassList.map(c => c.name)))
          .map(name => teacherClassList.find(c => c.name === name));

        return (
          <div className="space-y-6 animate-fade-in">
            
            {/* VIEW 1: CLASS SELECTION CARDS FOR MARKS ENTRY & FEE OVERVIEW */}
            {!selectedMarksClassId && !selectedFeeClassId && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-[#1b4d3e]" />
                    <span>Select Class to Enter or Edit Exam Marks</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing class section assigned to you as Class Teacher by the Principal.
                  </p>
                </div>

                {uniqueClassTeacherClasses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uniqueClassTeacherClasses.map(cls => {
                      const classStudents = students[cls.id] || [];
                      const classMarksCount = (studentMarks[cls.id] || []).length;

                      const classFeeRecords = studentFees[cls.id] || [];
                      const totalClassReceivables = classFeeRecords.reduce((sum, f) => sum + (f.totalFee || 45000), 0);
                      const classPaidSum = classFeeRecords.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
                      const classDueSum = classFeeRecords.reduce((sum, f) => sum + (f.dueAmount || 0), 0);
                      const paidStudentsCount = classFeeRecords.filter(f => f.status === 'PAID').length;
                      const dueStudentsCount = classFeeRecords.filter(f => f.status === 'DUE').length;

                      return (
                        <React.Fragment key={cls.id}>
                          {/* CARD 1: MARKS & EXAM ROSTER CARD */}
                          <div className="border border-slate-200 rounded-2xl p-5 hover:border-[#1b4d3e] transition-all bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 shadow-sm">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-[#1b4d3e] text-xs font-bold rounded-full mb-1">
                                  {cls.name}
                                </span>
                                <div className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
                                  <Users className="w-3.5 h-3.5" />
                                  <span>{classStudents.length} Students Enrolled</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                                {classMarksCount} Scorecards Created
                              </span>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                              <div className="text-xs text-slate-600 font-medium">
                                Class Teacher: <span className="font-bold text-[#1b4d3e]">{cls.classTeacher}</span>
                              </div>

                              <button
                                onClick={() => setSelectedMarksClassId(cls.id)}
                                className="px-4 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                              >
                                <span>Open Class Roster</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* CARD 2: CLASS STUDENT FEE & FINANCIAL STATUS CARD (Matching light color theme of left card) */}
                          <div className="border border-slate-200 rounded-2xl p-5 hover:border-[#1b4d3e] transition-all bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 shadow-sm">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#1b4d3e] flex items-center justify-center border border-emerald-200">
                                    <CreditCard className="w-4 h-4 text-[#1b4d3e]" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-extrabold uppercase text-[#1b4d3e] block">Financial Status</span>
                                    <h3 className="text-sm font-black text-slate-900">{cls.name} Fee Overview</h3>
                                  </div>
                                </div>
                                <span className="bg-emerald-100 text-[#1b4d3e] border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                                  {paidStudentsCount}/{classStudents.length || 15} Paid
                                </span>
                              </div>

                              {/* KPI Grid */}
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Total Fee</span>
                                  <span className="text-xs font-black text-slate-900 font-mono">₹{totalClassReceivables.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                                  <span className="text-[9px] font-bold text-emerald-800 uppercase block">Collected</span>
                                  <span className="text-xs font-black text-emerald-800 font-mono">₹{classPaidSum.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                                  <span className="text-[9px] font-bold text-amber-900 uppercase block">Due Balance</span>
                                  <span className="text-xs font-black text-amber-900 font-mono">₹{classDueSum.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                              <div className="text-[11px] text-slate-600 font-medium">
                                {dueStudentsCount > 0 ? (
                                  <span className="text-amber-800 font-bold flex items-center space-x-1">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>{dueStudentsCount} Student(s) Fee Due</span>
                                  </span>
                                ) : (
                                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>All Class Fees Cleared!</span>
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => setSelectedFeeClassId(cls.id)}
                                className="px-4 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                              >
                                <span>Check Fee Roster</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-2">
                    <div className="text-2xl">⚠️</div>
                    <h3 className="text-sm font-bold text-amber-900">No Class Teacher Assignment Found</h3>
                    <p className="text-xs text-amber-800 max-w-md mx-auto">
                      You have not been assigned as Class Teacher for any class section yet. Please contact your Principal to assign you as Class Teacher to add academic exam marks.
                    </p>
                  </div>
                )}
              </div>
            )}

          {/* VIEW 2: CLASS ROSTER PAGE FOR MARKS ENTRY */}
          {selectedMarksClassId && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-5">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedMarksClassId(null)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Exam Marks Roster — {classes.find(c => c.id === selectedMarksClassId)?.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select or create an exam roster to input student subject scores.
                    </p>
                  </div>
                </div>

                {/* Right Action Bar - Highlighted Create Exam Roster */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  
                  {/* Exam Roster Selector */}
                  <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <BookOpen className="w-3.5 h-3.5 text-[#1b4d3e] ml-1.5" />
                    <select
                      value={selectedExamName}
                      onChange={(e) => setSelectedExamName(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-2 cursor-pointer"
                    >
                      {Array.from(new Set([
                        'Mid-Term Examination 2026',
                        'Unit Test 1 - 2026',
                        ...(examRosters.filter(r => r.classId === selectedMarksClassId).map(r => r.examName)),
                        ...((studentMarks[selectedMarksClassId] || []).map(r => r.examName))
                      ])).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Create New Exam Roster Button (Highlighted Place) */}
                  <button
                    onClick={() => {
                      setNewExamNameInput('');
                      setShowCreateRosterModal(true);
                    }}
                    className="px-3.5 py-2 bg-[#1b4d3e] hover:bg-[#143c30] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md cursor-pointer border border-emerald-600"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-200" />
                    <span>Create Exam Roster</span>
                  </button>

                  <button
                    onClick={() => setSelectedMarksClassId(null)}
                    className="text-xs text-[#1b4d3e] font-bold hover:underline cursor-pointer ml-1"
                  >
                    ← Back to Class Cards
                  </button>
                </div>
              </div>

              {/* Student Roster Table for Marks */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3">Roll #</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Exam Name</th>
                      <th className="p-3">Total Score</th>
                      <th className="p-3">Fee Status</th>
                      <th className="p-3">Grade & Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {(students[selectedMarksClassId] || []).map(st => {
                      const classRecords = studentMarks[selectedMarksClassId] || [];
                      const record = classRecords.find(r => r.rollNo === st.rollNo && r.examName === selectedExamName);
                      const stFee = (studentFees[selectedMarksClassId] || []).find(f => f.rollNo === st.rollNo) || { status: 'PAID', dueAmount: 0 };

                      return (
                        <tr key={st.rollNo} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-900">#{st.rollNo}</td>
                          
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <img src={st.photo} alt={st.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                              <span className="font-bold text-slate-900">{st.name}</span>
                            </div>
                          </td>

                          <td className="p-3 text-xs text-slate-600 font-medium">{selectedExamName}</td>

                          <td className="p-3 font-mono font-bold text-slate-900">
                            {record ? `${record.totalMarks} / ${record.maxMarks}` : '—'}
                          </td>

                          {/* Fee Status Badge for Teacher View */}
                          <td className="p-3">
                            {stFee.status === 'PAID' ? (
                              <span className="inline-flex items-center space-x-1 text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                <span>PAID</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                                <Clock className="w-3 h-3 text-amber-700" />
                                <span>DUE: ₹{(stFee.dueAmount || 15000).toLocaleString('en-IN')}</span>
                              </span>
                            )}
                          </td>

                          <td className="p-3 font-medium text-slate-600">
                            {record ? record.examName : <span className="text-slate-400 italic font-mono">{selectedExamName}</span>}
                          </td>

                          <td className="p-3 font-mono font-bold text-slate-900">
                            {record ? `${record.totalMarks} / 500` : '-'}
                          </td>

                          <td className="p-3 font-mono font-bold text-[#1b4d3e]">
                            {record ? `${record.percentage}%` : '-'}
                          </td>

                          <td className="p-3">
                            {record ? (
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                record.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                              }`}>
                                Grade {record.grade} • {record.status}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Pending</span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedStudentForMarks(st)}
                              className="px-3 py-1.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center space-x-1 ml-auto cursor-pointer"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>{record ? 'Edit Marks' : 'Add Marks'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* VIEW 3: CLASS ROSTER PAGE FOR FEE & PAYMENT DETAILS */}
          {selectedFeeClassId && (() => {
            const feeClassObj = classes.find(c => c.id === selectedFeeClassId) || { name: 'Class Section' };
            const classStudentList = students[selectedFeeClassId] || [];
            const feeRecords = studentFees[selectedFeeClassId] || [];

            const combinedFeeList = classStudentList.map(st => {
              const feeObj = feeRecords.find(f => f.rollNo === st.rollNo) || {
                rollNo: st.rollNo,
                totalFee: 45000,
                tuitionFee: 30000,
                examFee: 5000,
                labFee: 6000,
                libraryFee: 4000,
                paidAmount: 30000,
                dueAmount: 15000,
                status: 'DUE',
                dueDate: '15 Aug 2026'
              };
              return { ...st, ...feeObj };
            });

            const filteredFeeList = combinedFeeList.filter(st => {
              if (feeStatusFilter !== 'all' && st.status !== feeStatusFilter) return false;
              if (feeSearchQuery.trim()) {
                const q = feeSearchQuery.toLowerCase();
                return st.name.toLowerCase().includes(q) || String(st.rollNo).includes(q);
              }
              return true;
            });

            const totalReceivables = combinedFeeList.reduce((sum, f) => sum + (f.totalFee || 45000), 0);
            const totalCollected = combinedFeeList.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
            const totalDue = combinedFeeList.reduce((sum, f) => sum + (f.dueAmount || 0), 0);
            const paidCount = combinedFeeList.filter(f => f.status === 'PAID').length;

            return (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6 animate-fade-in">
                
                {/* Header with Back Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedFeeClassId(null)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-[#1b4d3e]" />
                        <span>Class Student Fee & Payment Roster — {feeClassObj.name}</span>
                      </h2>
                      <p className="text-xs text-slate-500">
                        View financial status, collected fees, outstanding dues, and parent reminders.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFeeClassId(null)}
                    className="text-xs text-[#1b4d3e] font-bold hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <span>← Back to Class Cards</span>
                  </button>
                </div>

                {/* Summary Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Class Receivables</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">₹{totalReceivables.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{classStudentList.length} Students Enrolled</div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Collected Amount</span>
                    <div className="text-2xl font-black text-emerald-800 mt-1">₹{totalCollected.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-emerald-700 font-medium">✓ {paidCount} / {classStudentList.length} Fully Paid</div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Total Outstanding Balance</span>
                    <div className="text-2xl font-black text-amber-900 mt-1">₹{totalDue.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-amber-800 font-medium">⚠️ {classStudentList.length - paidCount} Student(s) Fee Due</div>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search student or roll #..."
                      value={feeSearchQuery}
                      onChange={(e) => setFeeSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1b4d3e]"
                    />
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <select
                      value={feeStatusFilter}
                      onChange={(e) => setFeeStatusFilter(e.target.value)}
                      className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Fee Status</option>
                      <option value="PAID">Fully Paid</option>
                      <option value="DUE">Outstanding Due</option>
                    </select>
                  </div>
                </div>

                {/* Student Fee Roster Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="p-3.5">Roll #</th>
                        <th className="p-3.5">Student Name</th>
                        <th className="p-3.5">Total Fee</th>
                        <th className="p-3.5">Paid Amount</th>
                        <th className="p-3.5">Due Balance</th>
                        <th className="p-3.5">Payment Status</th>
                        <th className="p-3.5">Payment Date / Ref</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium bg-white">
                      {filteredFeeList.length > 0 ? (
                        filteredFeeList.map(st => (
                          <tr key={st.rollNo} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-slate-900">#{st.rollNo}</td>
                            <td className="p-3.5 font-bold text-slate-900">
                              <div className="flex items-center space-x-2.5">
                                <img src={st.photo} alt={st.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                                <div>
                                  <span className="font-extrabold block text-slate-900">{st.name}</span>
                                  <span className="text-[10px] text-slate-400 font-normal">{st.parentPhone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-slate-900">₹{st.totalFee.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 font-mono font-bold text-emerald-700">₹{st.paidAmount.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 font-mono font-bold text-amber-800">
                              {st.dueAmount > 0 ? `₹${st.dueAmount.toLocaleString('en-IN')}` : '₹0'}
                            </td>
                            <td className="p-3.5">
                              {st.status === 'PAID' ? (
                                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 w-fit">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  <span>PAID</span>
                                </span>
                              ) : (
                                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 w-fit">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>DUE</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-xs text-slate-600 font-mono">
                              {st.status === 'PAID' ? (
                                <div>
                                  <span className="font-bold text-slate-900 block">{st.paidDate}</span>
                                  <span className="text-[10px] text-[#1b4d3e] font-semibold">{st.transactionId}</span>
                                </div>
                              ) : (
                                <span className="text-amber-800 font-medium">Due by {st.dueDate}</span>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              {st.status === 'DUE' ? (
                                <button
                                  onClick={() => {
                                    showToast(`Fee Payment Reminder & WhatsApp Alert sent to ${st.name}'s parent (${st.parentPhone})!`, 'success');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300 transition-all cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                                >
                                  <Send className="w-3 h-3 text-amber-700" />
                                  <span>Remind Parent</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    showToast(`Digital Fee Receipt for ${st.name} sent to parent (${st.parentPhone})!`, 'success');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1b4d3e] font-bold text-[11px] border border-emerald-300 transition-all cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                                >
                                  <Download className="w-3 h-3 text-emerald-700" />
                                  <span>Send Receipt</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                            No student records found matching search filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            );
          })()}

          {/* ADD / EDIT MARKS MODAL */}
          {selectedStudentForMarks && (
            <AddMarksModal
              student={selectedStudentForMarks}
              classId={selectedMarksClassId}
              initialExamName={selectedExamName}
              existingRecord={(studentMarks[selectedMarksClassId] || []).find(r => r.rollNo === selectedStudentForMarks.rollNo && r.examName === selectedExamName)}
              onClose={() => setSelectedStudentForMarks(null)}
            />
          )}

          {/* CREATE EXAM ROSTER MODAL */}
          {showCreateRosterModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2 text-[#1b4d3e]">
                    <Award className="w-5 h-5" />
                    <h3 className="text-base font-extrabold text-slate-900">Create New Exam Roster</h3>
                  </div>
                  <button
                    onClick={() => setShowCreateRosterModal(false)}
                    className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Enter Examination Title / Exam Name *
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={newExamNameInput}
                    onChange={(e) => setNewExamNameInput(e.target.value)}
                    placeholder="e.g. Unit Test 1, Quarterly Exam 2026, Mid-Term 2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                  />

                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                      Included Subjects (100 Marks Each):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md">📐 Mathematics</span>
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md">🔬 Science</span>
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md">📖 English</span>
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md">🌍 Social Studies</span>
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md">⚡ Physics</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateRosterModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newExamNameInput.trim()) return;
                      const roster = createExamRoster(selectedMarksClassId, newExamNameInput);
                      setSelectedExamName(roster.examName);
                      setShowCreateRosterModal(false);
                    }}
                    disabled={!newExamNameInput.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-200" />
                    <span>Create Roster</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
        );
      })()}

    </div>
  );
}
