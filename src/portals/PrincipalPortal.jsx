import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { getTodayLocalDateStr } from '../utils/dateUtils';
import PrincipalReports from '../subcomponents/PrincipalReports';
import OnboardTeacherModal from '../components/OnboardTeacherModal';
import CreateClassModal from '../components/CreateClassModal';
import StudentReportModal from '../subcomponents/StudentReportModal';
import AssignTeacherModal from '../subcomponents/AssignTeacherModal';
import TeacherLeaveModal from '../subcomponents/TeacherLeaveModal';
import AcademicScorecardManager from '../subcomponents/AcademicScorecardManager';
import { Shield, Bell, CheckCircle2, XCircle, MessageSquare, BarChart3, Sun, Moon, AlertTriangle, UserPlus, PlusCircle, Users, School, Award, ArrowLeft, ChevronRight, FileText, Copy, GraduationCap, UserCheck, CreditCard, Clock, Search, Send, Download, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PrincipalPortal() {
  const { classes, teachers, students, submissions, approveAttendance, declineAttendance, whatsappLogs, setActiveWhatsAppPreview, leaveApplications = [], approveLeaveApplication, declineLeaveApplication, teacherLeaveRequests = [], approveTeacherLeaveRequest, declineTeacherLeaveRequest, attendanceReminders = [], triggerManualReminder, studentMarks, studentFees = {}, showToast, activeSchool } = useAttendance();
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'overview' | 'manage' | 'whatsapp' | 'scorecards' | 'fees'

  // Pending Teacher Leave Applications
  const pendingTeacherLeaveRequests = teacherLeaveRequests.filter(r => r.status === 'PENDING');

  // Teacher Management & Leave State
  const [selectedTeacherForLeave, setSelectedTeacherForLeave] = useState(null);

  // Fee Overview State
  const [feeClassFilter, setFeeClassFilter] = useState('all');
  const [feeStatusFilter, setFeeStatusFilter] = useState('all');
  const [feeSearchQuery, setFeeSearchQuery] = useState('');

  // Teacher Assignment Modal State
  const [assigningTeacher, setAssigningTeacher] = useState(null);

  // Principal Marks View State
  const [selectedPrincipalMarksClassId, setSelectedPrincipalMarksClassId] = useState(null);
  const [viewingStudentScorecard, setViewingStudentScorecard] = useState(null);

  // Teacher Performance Modal State
  const [selectedTeacherForPerformance, setSelectedTeacherForPerformance] = useState(null);

  // Modal triggers
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);

  const submissionList = Object.values(submissions);
  const pendingList = submissionList.filter(s => s.status === 'PENDING_APPROVAL');
  const pendingLeaveApps = leaveApplications.filter(l => l.status === 'PENDING_APPROVAL');
  const declinedList = submissionList.filter(s => s.status === 'DECLINED');

  const handleApprove = (submissionId) => {
    approveAttendance(submissionId);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if canvas-confetti non-supported
    }
  };

  const handleDecline = (submissionId) => {
    const reason = prompt('Enter reason for declining attendance submission:', 'Incorrect status marked for student(s). Please verify and re-submit.');
    if (reason !== null) {
      declineAttendance(submissionId, reason);
    }
  };

  let totalPresentRecorded = 0;
  let totalAbsentRecorded = 0;
  let totalUnplannedAbsent = 0;

  submissionList.forEach(s => {
    totalPresentRecorded += s.stats?.present || 0;
    totalAbsentRecorded += s.stats?.absent || 0;
    totalUnplannedAbsent += s.stats?.unplannedAbsent || 0;
  });

  const overallAttendanceRate = totalPresentRecorded + totalAbsentRecorded > 0
    ? Math.round((totalPresentRecorded / (totalPresentRecorded + totalAbsentRecorded)) * 100)
    : 95;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Principal Header */}
      <div className="bg-[#1b4d3e] text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-800/80 text-emerald-100 text-xs px-3 py-1 rounded-full border border-emerald-400/30 font-semibold mb-2">
              <Shield className="w-4 h-4 text-emerald-300" />
              <span>Principal Command Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">School Attendance & Faculty Oversight</h1>
            <p className="text-xs text-emerald-100/90 mt-1">Manage faculty onboarding, create classes with teacher occupancy checks, approve attendance & view reports</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Onboard Teacher Button */}
            <button
              onClick={() => setShowOnboardModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800/90 text-white hover:bg-emerald-700 border border-emerald-400/40 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-200" />
              <span>+ Onboard Teacher</span>
            </button>

            {/* Create Class Button */}
            <button
              onClick={() => setShowCreateClassModal(true)}
              className="px-4 py-2 rounded-xl bg-white text-[#1b4d3e] text-xs font-black shadow-md hover:bg-emerald-50 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#1b4d3e]" />
              <span>+ Create Class</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Overall Attendance</div>
          <div className="text-2xl md:text-3xl font-black text-[#1b4d3e] mt-1">{overallAttendanceRate}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">School-wide average</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Pending Approvals</div>
          <div className="text-2xl md:text-3xl font-black text-amber-600 mt-1">{pendingList.length}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Submissions in queue</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Faculty Onboarded</div>
          <div className="text-2xl md:text-3xl font-black text-[#1b4d3e] mt-1">{teachers.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active Teachers</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Classes Managed</div>
          <div className="text-2xl md:text-3xl font-black text-sky-700 mt-1">{classes.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Total Class Sections</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 space-x-1 overflow-x-auto shadow-sm">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'approvals'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Pending Approvals ({pendingList.length + pendingLeaveApps.length + pendingTeacherLeaveRequests.length})</span>
          {(pendingList.length > 0 || pendingLeaveApps.length > 0 || pendingTeacherLeaveRequests.length > 0) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'manage'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty & Class Management</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <School className="w-4 h-4" />
          <span>All Classes Status ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'whatsapp'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Alert Logs ({whatsappLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scorecards')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'scorecards' || activeTab === 'marks'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Academic Scorecards & Exam Marks</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'fees'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-300" />
          <span>School Fee & Revenue Collections</span>
        </button>

        <button
          onClick={() => setActiveTab('student_logins')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'student_logins'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Student ID Logins Roster</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">

          {/* SECTION A.1: FACULTY TEACHER LEAVE APPLICATIONS */}
          <div className="bg-white border border-amber-200 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                <span>Faculty Teacher Leave Applications ({pendingTeacherLeaveRequests.length} Pending Approval)</span>
              </h2>
              <span className="text-xs text-amber-800 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full">Principal Review</span>
            </div>

            {pendingTeacherLeaveRequests.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No pending faculty teacher leave applications awaiting approval.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingTeacherLeaveRequests.map(req => {
                  const reqTeacherObj = teachers.find(t => t.id === req.teacherId || t.name === req.teacherName || t.username === req.teacherId);

                  return (
                    <div key={req.id} className="p-4.5 rounded-2xl border border-amber-300 bg-amber-50/60 space-y-3 relative shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="bg-[#1b4d3e] text-white text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-md">
                            {req.leaveType}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm">{req.teacherName}</h4>
                        </div>
                        <span className="bg-white text-slate-800 border border-slate-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                          {req.className}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="text-slate-500">
                          Leave Duration: <span className="font-mono text-slate-900 font-extrabold">📅 {req.startDate} to {req.endDate} ({req.durationLabel})</span>
                        </div>
                        <div className="text-slate-700 font-medium">
                          Reason: <span className="italic">"{req.reason}"</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-1">
                        <button
                          onClick={() => {
                            const r = prompt('Enter decline reason for teacher leave:', 'Leave request not approved.');
                            if (r !== null) {
                              declineTeacherLeaveRequest(req.id);
                              showToast(`Leave request for ${req.teacherName} DECLINED.`, 'info');
                            }
                          }}
                          className="w-1/2 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline Leave</span>
                        </button>

                        <button
                          onClick={() => {
                            approveTeacherLeaveRequest(req.id);
                            showToast(`Leave for ${req.teacherName} APPROVED! Opening Substitute Assignment...`, 'success');
                            if (reqTeacherObj) {
                              setSelectedTeacherForLeave(reqTeacherObj);
                            }
                          }}
                          className="w-1/2 py-2 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                          <span>Approve & Assign Substitute</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION A: PRE-PLANNED STUDENT LEAVE APPLICATIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <School className="w-5 h-5 text-[#1b4d3e]" />
                <span>Pre-Planned Student Leave Requests ({pendingLeaveApps.length} Pending)</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">Requires Principal Approval</span>
            </div>

            {pendingLeaveApps.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No pending student pre-planned leave applications awaiting approval.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingLeaveApps.map(app => (
                  <div key={app.id} className="p-4 rounded-2xl border border-amber-300 bg-amber-50/50 space-y-3 relative shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#1b4d3e] text-white text-xs font-mono font-bold px-2 py-0.5 rounded-md">
                          Roll #{app.studentRoll}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{app.studentName}</h4>
                      </div>
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {app.classId}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-slate-500">
                        Requested Date: <span className="font-mono text-slate-900 font-extrabold">📅 {app.leaveDate}</span>
                      </div>
                      <div className="text-slate-700 font-medium">
                        Reason: <span className="italic">"{app.reason}"</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => {
                          const r = prompt('Enter decline reason for student leave:', 'Not approved for requested date.');
                          if (r !== null) declineLeaveApplication(app.id, r);
                        }}
                        className="w-1/2 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline Leave</span>
                      </button>

                      <button
                        onClick={() => approveLeaveApplication(app.id)}
                        className="w-1/2 py-2 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>Approve Leave</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION B: TEACHER DAILY ATTENDANCE SUBMISSIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Bell className="w-5 h-5 text-[#1b4d3e]" />
                <span>Faculty Attendance Submissions Awaiting Approval</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">{pendingList.length} Pending</span>
            </div>

          {pendingList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">All Clear! No Pending Approvals</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Teachers will submit daily attendance here for your review and approval.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingList.map(submission => (
                <div key={submission.id} className="bg-white border border-amber-300 rounded-3xl p-6 shadow-md space-y-4 relative">
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-300">
                        {submission.classId}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-2">{submission.classId} Attendance</h3>
                      <p className="text-xs text-slate-500">
                        Submitted by <span className="text-[#1b4d3e] font-semibold">{submission.teacherName}</span> at {submission.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Submission Stats */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center text-xs">
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">Present</div>
                      <div className="text-base font-black text-emerald-600">{submission.stats.present}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">Planned Leave</div>
                      <div className="text-base font-black text-amber-600">{submission.stats.plannedLeave}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">Unplanned Absent</div>
                      <div className="text-base font-black text-rose-600">{submission.stats.unplannedAbsent}</div>
                    </div>
                  </div>

                  {/* Approve / Decline Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => handleDecline(submission.id)}
                      className="w-1/2 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline Submission</span>
                    </button>

                    <button
                      onClick={() => handleApprove(submission.id)}
                      className="w-1/2 py-2.5 rounded-xl bg-[#1b4d3e] text-white text-xs font-bold shadow-md hover:bg-[#143c30] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Attendance</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* TAB 2: FACULTY & CLASS MANAGEMENT */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#1b4d3e]" />
                <span>Faculty Onboarding & Teacher Occupancy Status</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Each teacher can take attendance for assigned classes (max 2) and can be assigned as Class Teacher (1 Class) for Academic Exam Marks & Scorecards by the Principal.
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowOnboardModal(true)}
                className="px-4 py-2 rounded-xl bg-[#1b4d3e] text-white hover:bg-[#143c30] text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Onboard New Teacher</span>
              </button>

              <button
                onClick={() => setShowCreateClassModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-100 text-[#1b4d3e] border border-emerald-300 hover:bg-emerald-200 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Class & Add 15 Students</span>
              </button>
            </div>
          </div>

          {/* Teacher Directory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map(teacher => {
              const assignedCount = teacher.assignedClasses ? teacher.assignedClasses.length : 0;
              const classTeacherObj = classes.find(c => 
                (teacher.classTeacherClassId && c.id === teacher.classTeacherClassId) || 
                (c.teacherId && (c.teacherId === teacher.id || c.teacherId === teacher.username)) || 
                (c.classTeacher && c.classTeacher === teacher.name)
              );

              return (
                <div key={teacher.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-md relative hover:border-[#1b4d3e] transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div
                        onClick={() => setSelectedTeacherForPerformance(teacher)}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
                          {teacher.avatar}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#1b4d3e] group-hover:underline flex items-center space-x-1">
                            <span>{teacher.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#1b4d3e]" />
                          </h3>
                          <div className="text-[11px] text-slate-500">
                            Username: <span className="font-mono text-[#1b4d3e] font-semibold">{teacher.username}</span>
                          </div>
                        </div>
                      </div>

                      {classTeacherObj ? (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1">
                          <span>⭐ Class Teacher</span>
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                          Unassigned
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Attendance Classes (Max 2):</div>
                        {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {teacher.assignedClasses.map(cId => {
                              const cObj = classes.find(c => c.id === cId);
                              return (
                                <span key={cId} className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  {cObj ? `${cObj.name} (${cObj.shift})` : cId}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">No attendance classes assigned</div>
                        )}
                      </div>

                      <div className="border-t border-slate-200 pt-1.5">
                        <div className="text-[10px] text-emerald-800 font-bold uppercase flex items-center space-x-1">
                          <span>⭐ Class Teacher (Exam Scorecards):</span>
                        </div>
                        {classTeacherObj ? (
                          <div className="mt-1">
                            <span className="bg-[#1b4d3e] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg inline-block shadow-2xs">
                              {classTeacherObj.name}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-amber-700 italic font-semibold mt-0.5">
                            No Class Teacher assigned — Click below to assign
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setAssigningTeacher(teacher)}
                        className="flex-1 py-2 bg-emerald-50 hover:bg-[#1b4d3e] text-[#1b4d3e] hover:text-white border border-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-2xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{classTeacherObj ? 'Change Class Teacher' : 'Assign Class Teacher'}</span>
                      </button>

                      <button
                        onClick={() => setSelectedTeacherForPerformance(teacher)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all shadow-2xs cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Performance</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedTeacherForLeave(teacher)}
                      className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>📅 Assign Leave / Substitute (1-2 Days)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: OVERVIEW ALL CLASSES */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map(cls => {
            const dateStr = getTodayLocalDateStr();
            const sub = submissions[`${cls.id}_${dateStr}`];

            return (
              <div key={cls.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>
                    <div className="text-xs text-slate-500">{cls.shift} ({cls.shiftTime})</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    sub?.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : sub?.status === 'DECLINED'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : sub?.status === 'PENDING_APPROVAL'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {sub ? sub.status : 'NOT SUBMITTED'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>Class Teacher: <span className="font-semibold text-[#1b4d3e]">{cls.classTeacher}</span></div>
                  <div>Enrolled Students: <span className="font-mono text-slate-900 font-bold">{cls.totalStudents || 15} Students</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: WHATSAPP ALERTS */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#1b4d3e]" />
              <span>WhatsApp Parent Alert System Logs</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">{whatsappLogs.length} Total Alerts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Parent Phone</th>
                  <th className="p-3">Alert Message</th>
                  <th className="p-3">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {whatsappLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900">#{log.rollNo} {log.studentName}</td>
                    <td className="p-3 font-mono text-[#1b4d3e] font-semibold">{log.classId}</td>
                    <td className="p-3 font-mono text-slate-600">{log.parentPhone}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{log.message}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        ✓ {log.status || 'Sent to WhatsApp'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: OVERALL PERFORMANCE REPORTS */}
      {activeTab === 'reports' && <PrincipalReports />}

      {/* TAB: ACADEMIC EXAM MARKS & SCORECARDS */}
      {(activeTab === 'scorecards' || activeTab === 'marks') && (
        <AcademicScorecardManager userRole="principal" />
      )}

      {/* TAB: STUDENT UNIQUE ID LOGINS ROSTER */}
      {activeTab === 'student_logins' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-[#1b4d3e]" />
                <span>Student Unique ID & Login Credentials Roster</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Students log in using their unique auto-generated Student ID as both Username and Password to view digital scorecards and attendance records.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3.5">Roll #</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Class</th>
                  <th className="p-3.5">Student ID (Username)</th>
                  <th className="p-3.5">Default Password</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium bg-white">
                {Object.entries(students).flatMap(([cId, stList]) => {
                  const clsObj = classes.find(c => c.id === cId) || { name: cId };
                  return stList.map(st => {
                    const studentId = st.studentId || `${activeSchool?.code || 'SCH1'}-STU-${st.rollNo}`;
                    return (
                      <tr key={`${cId}_${st.rollNo}`} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-900">#{st.rollNo}</td>
                        <td className="p-3.5 font-bold text-slate-900">
                          <div className="flex items-center space-x-2.5">
                            <img src={st.photo} alt={st.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                            <span>{st.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">{clsObj.name}</td>
                        <td className="p-3.5 font-mono font-extrabold text-[#1b4d3e]">{studentId}</td>
                        <td className="p-3.5 font-mono text-slate-700">{studentId}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`Username: ${studentId}\nPassword: ${studentId}`);
                              showToast(`Copied login credentials for ${st.name}!`, 'success');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#1b4d3e] font-bold text-[11px] border border-emerald-200 transition-all cursor-pointer inline-flex items-center space-x-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Login Credentials</span>
                          </button>
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: SCHOOL FEE & REVENUE COLLECTIONS OVERVIEW */}
      {activeTab === 'fees' && (() => {
        // Flatten student fee records
        const allFeeRecords = Object.entries(studentFees).flatMap(([cId, feeList]) => {
          const clsObj = classes.find(c => c.id === cId) || { name: cId };
          const classStudentList = students[cId] || [];
          return feeList.map(fee => {
            const stObj = classStudentList.find(s => s.rollNo === fee.rollNo) || { name: `Student #${fee.rollNo}`, parentPhone: '+91 98765 00000', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' };
            return {
              ...fee,
              classId: cId,
              className: clsObj.name,
              studentName: stObj.name,
              parentPhone: stObj.parentPhone,
              photo: stObj.photo
            };
          });
        });

        // Filtered records
        const filteredFees = allFeeRecords.filter(f => {
          if (feeClassFilter !== 'all' && f.classId !== feeClassFilter) return false;
          if (feeStatusFilter !== 'all' && f.status !== feeStatusFilter) return false;
          if (feeSearchQuery.trim()) {
            const q = feeSearchQuery.toLowerCase();
            return f.studentName.toLowerCase().includes(q) || String(f.rollNo).includes(q) || f.className.toLowerCase().includes(q);
          }
          return true;
        });

        const totalReceivables = allFeeRecords.reduce((sum, f) => sum + (f.totalFee || 45000), 0);
        const totalCollected = allFeeRecords.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
        const totalOutstanding = allFeeRecords.reduce((sum, f) => sum + (f.dueAmount || 0), 0);
        const collectionRate = totalReceivables > 0 ? Math.round((totalCollected / totalReceivables) * 100) : 100;

        return (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header & Metrics */}
            <div className="bg-[#1b4d3e] text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/60 pb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-emerald-200 flex items-center justify-center border border-emerald-600 shadow-md">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center space-x-1.5 bg-emerald-800 text-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                      <span>💰 Executive Revenue & Collection Dashboard</span>
                    </div>
                    <h2 className="text-xl font-black text-white">School Fee & Revenue Collections</h2>
                  </div>
                </div>

                <div className="bg-emerald-800/80 border border-emerald-600 px-4 py-2 rounded-2xl text-right">
                  <span className="text-[10px] font-bold text-emerald-200 uppercase block">Collection Rate</span>
                  <span className="text-xl font-black text-white font-mono">{collectionRate}%</span>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#143c30] border border-emerald-700/60 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-emerald-300">Total Annual Receivables</span>
                  <div className="text-2xl font-black text-white mt-1">₹{totalReceivables.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-emerald-200/80 mt-0.5">Academic Year 2026-27</div>
                </div>

                <div className="bg-emerald-900/60 border border-emerald-500/50 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-emerald-300">Total Collected Fee</span>
                  <div className="text-2xl font-black text-emerald-300 mt-1">₹{totalCollected.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-emerald-200/80 mt-0.5">✓ Verified & Deposited</div>
                </div>

                <div className="bg-amber-950/60 border border-amber-500/40 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-amber-300">Total Outstanding Due</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-amber-200/80 mt-0.5">⚠️ Pending Collection</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search student or roll #..."
                  value={feeSearchQuery}
                  onChange={(e) => setFeeSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <select
                  value={feeClassFilter}
                  onChange={(e) => setFeeClassFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Class Sections</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.shift})</option>
                  ))}
                </select>

                <select
                  value={feeStatusFilter}
                  onChange={(e) => setFeeStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Fee Status</option>
                  <option value="PAID">Fully Paid</option>
                  <option value="DUE">Outstanding Due</option>
                </select>
              </div>

            </div>

            {/* Master Student Fee Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3.5">Roll #</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Class Section</th>
                    <th className="p-3.5">Total Fee</th>
                    <th className="p-3.5">Paid Amount</th>
                    <th className="p-3.5">Due Balance</th>
                    <th className="p-3.5">Fee Status</th>
                    <th className="p-3.5">Payment Date / Ref</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium bg-white">
                  {filteredFees.length > 0 ? (
                    filteredFees.map(item => (
                      <tr key={`${item.classId}_${item.rollNo}`} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-900">#{item.rollNo}</td>
                        <td className="p-3.5 font-bold text-slate-900">
                          <div className="flex items-center space-x-2.5">
                            <img src={item.photo} alt={item.studentName} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                            <div>
                              <span className="font-extrabold block text-slate-900">{item.studentName}</span>
                              <span className="text-[10px] text-slate-400">{item.parentPhone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">{item.className}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">₹{item.totalFee.toLocaleString('en-IN')}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-700">₹{item.paidAmount.toLocaleString('en-IN')}</td>
                        <td className="p-3.5 font-mono font-bold text-amber-800">
                          {item.dueAmount > 0 ? `₹${item.dueAmount.toLocaleString('en-IN')}` : '₹0'}
                        </td>
                        <td className="p-3.5">
                          {item.status === 'PAID' ? (
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
                          {item.status === 'PAID' ? (
                            <div>
                              <span className="font-bold text-slate-900 block">{item.paidDate}</span>
                              <span className="text-[10px] text-[#1b4d3e] font-semibold">{item.transactionId}</span>
                            </div>
                          ) : (
                            <span className="text-amber-800 font-medium">Due by {item.dueDate}</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          {item.status === 'DUE' ? (
                            <button
                              onClick={() => {
                                showToast(`Fee Payment Reminder & WhatsApp Alert sent to ${item.studentName}'s parent (${item.parentPhone})!`, 'success');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300 transition-all cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                            >
                              <Send className="w-3 h-3 text-amber-700" />
                              <span>Remind Parent</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                showToast(`Digital Payment Receipt for ${item.studentName} generated & sent!`, 'success');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1b4d3e] font-bold text-[11px] border border-emerald-300 transition-all cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                            >
                              <Download className="w-3 h-3 text-emerald-700" />
                              <span>Receipt Sent</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400 italic">
                        No fee records matching search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        );
      })()}

      {/* ONBOARD TEACHER MODAL */}
      {showOnboardModal && (
        <OnboardTeacherModal onClose={() => setShowOnboardModal(false)} />
      )}

      {/* CREATE CLASS MODAL */}
      {showCreateClassModal && (
        <CreateClassModal
          onClose={() => setShowCreateClassModal(false)}
          onOpenOnboardTeacher={() => {
            setShowCreateClassModal(false);
            setShowOnboardModal(true);
          }}
        />
      )}

      {/* TEACHER STUDENT PERFORMANCE OVERVIEW MODAL */}
      {selectedTeacherForPerformance && (() => {
        const tName = selectedTeacherForPerformance.name;
        const assignedClassIds = selectedTeacherForPerformance.assignedClasses || classes.filter(c => c.classTeacher === tName).map(c => c.id);
        
        const teacherStudents = [];
        assignedClassIds.forEach(cId => {
          const clsObj = classes.find(c => c.id === cId) || { name: cId, shift: '' };
          const stList = students[cId] || [];
          stList.forEach(st => {
            teacherStudents.push({
              ...st,
              classId: cId,
              className: clsObj.name,
              shift: clsObj.shift
            });
          });
        });

        const teacherMarks = [];
        assignedClassIds.forEach(cId => {
          const classMarks = studentMarks[cId] || [];
          classMarks.forEach(m => teacherMarks.push(m));
        });

        const avgAttendancePct = teacherStudents.length > 0
          ? Math.round(teacherStudents.reduce((sum, st) => sum + (st.attendancePct || 90), 0) / teacherStudents.length)
          : 92;

        const totalExamRecords = teacherMarks.length;
        const passedExamRecords = teacherMarks.filter(m => m.status === 'PASSED').length;
        const passRatePct = totalExamRecords > 0 ? Math.round((passedExamRecords / totalExamRecords) * 100) : 100;

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-up my-8">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1b4d3e] text-2xl flex items-center justify-center border border-emerald-300">
                    {selectedTeacherForPerformance.avatar || '👨‍🏫'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-black text-slate-900">{tName}</h3>
                      <span className="bg-emerald-100 text-[#1b4d3e] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                        Faculty Performance Overview
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Username: <span className="font-mono font-bold text-slate-700">{selectedTeacherForPerformance.username || 'teacher'}</span> • Managing {assignedClassIds.length} Class Session(s)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTeacherForPerformance(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Assigned Classes</span>
                  <span className="text-lg font-black text-[#1b4d3e]">{assignedClassIds.length} Classes</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Students</span>
                  <span className="text-lg font-black text-slate-900">{teacherStudents.length} Enrolled</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Avg Attendance Rate</span>
                  <span className={`text-lg font-black ${avgAttendancePct >= 80 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {avgAttendancePct}%
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Academic Pass Rate</span>
                  <span className="text-lg font-black text-emerald-700">{passRatePct}% Passed</span>
                </div>
              </div>

              {/* Student Roster Table under this teacher */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-[#1b4d3e]" />
                    <span>Students Performance Directory ({teacherStudents.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">Eligibility Threshold: ≥80% Attendance</span>
                </div>

                <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-slate-200 rounded-2xl shadow-sm">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px] sticky top-0 z-10">
                      <tr>
                        <th className="p-3.5 whitespace-nowrap">Roll #</th>
                        <th className="p-3.5 whitespace-nowrap">Student Name</th>
                        <th className="p-3.5 whitespace-nowrap">Class</th>
                        <th className="p-3.5 whitespace-nowrap">Attendance %</th>
                        <th className="p-3.5 whitespace-nowrap">Eligibility</th>
                        <th className="p-3.5 whitespace-nowrap">Exam Score</th>
                        <th className="p-3.5 whitespace-nowrap text-right">Academic Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium bg-white">
                      {teacherStudents.map(st => {
                        const stAttendance = st.attendancePct || 90;
                        const isEligible = stAttendance >= 80;
                        const stMarks = teacherMarks.find(m => m.rollNo === st.rollNo);

                        return (
                          <tr key={`${st.classId}_${st.rollNo}`} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5 whitespace-nowrap font-mono font-bold text-slate-900">#{st.rollNo}</td>
                            <td className="p-3.5 whitespace-nowrap font-bold text-slate-900">
                              <button
                                onClick={() => {
                                  const fullStudentObj = {
                                    ...st,
                                    subjectMarks: stMarks?.subjectMarks || { Mathematics: 85, Science: 80, English: 90, SocialStudies: 88, Physics: 82 },
                                    marks: stMarks?.totalMarks || 425,
                                    totalMarks: stMarks?.totalMarks || 425,
                                    percentage: stMarks?.percentage || st.attendancePct || 85,
                                    grade: stMarks?.grade || 'A',
                                    status: stMarks?.status || 'PASSED'
                                  };
                                  setViewingStudentScorecard({ student: fullStudentObj, className: st.className });
                                }}
                                className="flex items-center space-x-2.5 text-slate-900 hover:text-[#1b4d3e] hover:underline cursor-pointer group text-left transition-all"
                              >
                                <img src={st.photo} alt={st.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform" />
                                <span className="font-extrabold">{st.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity text-[#1b4d3e]" />
                              </button>
                            </td>
                            <td className="p-3.5 whitespace-nowrap text-slate-600 font-medium">{st.className}</td>
                            <td className="p-3.5 whitespace-nowrap font-mono font-bold text-slate-900">{stAttendance}%</td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border inline-block ${
                                isEligible
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                              }`}>
                                {isEligible ? 'Eligible' : 'Low Attendance'}
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap font-mono font-bold">
                              {stMarks ? `${stMarks.totalMarks} / 500 (${stMarks.percentage}%)` : <span className="text-slate-400 font-normal italic">Pending</span>}
                            </td>
                            <td className="p-3.5 whitespace-nowrap text-right">
                              {stMarks ? (
                                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border inline-block ${
                                  stMarks.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                                }`}>
                                  Grade {stMarks.grade} • {stMarks.status}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">Pending</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedTeacherForPerformance(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all cursor-pointer border border-slate-300"
                >
                  Close Performance View
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* VIEWING INDIVIDUAL STUDENT SCORECARD REPORT MODAL */}
      {viewingStudentScorecard && (
        <StudentReportModal
          student={viewingStudentScorecard.student}
          className={viewingStudentScorecard.className}
          onClose={() => setViewingStudentScorecard(null)}
        />
      )}

      {/* ASSIGN TEACHER CLASS MODAL (1 Teacher : 1 Class) */}
      {assigningTeacher && (
        <AssignTeacherModal
          teacher={assigningTeacher}
          onClose={() => setAssigningTeacher(null)}
        />
      )}

      {/* TEACHER LEAVE & TEMPORARY SUBSTITUTE MODAL */}
      {selectedTeacherForLeave && (
        <TeacherLeaveModal
          teacher={selectedTeacherForLeave}
          onClose={() => setSelectedTeacherForLeave(null)}
        />
      )}

    </div>
  );
}
