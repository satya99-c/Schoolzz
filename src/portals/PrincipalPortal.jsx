import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import PrincipalReports from '../subcomponents/PrincipalReports';
import OnboardTeacherModal from '../components/OnboardTeacherModal';
import CreateClassModal from '../components/CreateClassModal';
import { Shield, Bell, CheckCircle2, XCircle, MessageSquare, BarChart3, Sun, Moon, AlertTriangle, UserPlus, PlusCircle, Users, School, Award, ArrowLeft, ChevronRight, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PrincipalPortal() {
  const { classes, teachers, students, submissions, approveAttendance, declineAttendance, whatsappLogs, setActiveWhatsAppPreview, leaveApplications = [], approveLeaveApplication, declineLeaveApplication, attendanceReminders = [], triggerManualReminder, studentMarks } = useAttendance();
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'overview' | 'manage' | 'whatsapp' | 'reports' | 'marks'

  // Principal Marks View State
  const [selectedPrincipalMarksClassId, setSelectedPrincipalMarksClassId] = useState(null);
  const [viewingStudentScorecard, setViewingStudentScorecard] = useState(null);

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
          <span>Pending Approvals ({pendingList.length + pendingLeaveApps.length})</span>
          {(pendingList.length > 0 || pendingLeaveApps.length > 0) && (
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
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Attendance Analytics Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('marks')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'marks'
              ? 'bg-[#1b4d3e] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Academic Scorecards & Marks</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">

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
                Each teacher can be assigned up to max 2 classes. Teachers with 2 classes are flagged as Occupied.
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
              const isOccupied = assignedCount >= 2;

              return (
                <div key={teacher.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-md relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center border border-emerald-200">
                        {teacher.avatar}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{teacher.name}</h3>
                        <div className="text-[11px] text-slate-500">
                          Username: <span className="font-mono text-[#1b4d3e] font-semibold">{teacher.username}</span>
                        </div>
                      </div>
                    </div>

                    {isOccupied ? (
                      <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ⚠️ Occupied ({assignedCount}/2)
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ✓ Available ({assignedCount}/2)
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1 text-xs">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Assigned Classes:</div>
                    {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {teacher.assignedClasses.map(cId => (
                          <span key={cId} className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                            {cId}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">No classes assigned yet</div>
                    )}
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
            const dateStr = new Date().toISOString().split('T')[0];
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

      {/* TAB 6: ACADEMIC EXAM SCORECARDS & MARKS VIEW */}
      {activeTab === 'marks' && (() => {
        const uniqueClassNamesList = Array.from(new Set(classes.map(c => c.name)));

        const uniqueScorecardClasses = uniqueClassNamesList.map(className => {
          const shiftClasses = classes.filter(c => c.name === className);
          const primaryClass = shiftClasses[0];
          const teacherNames = Array.from(new Set(shiftClasses.map(c => c.classTeacher))).join(' / ');

          const classStudentMap = {};
          const classMarksList = [];

          shiftClasses.forEach(cls => {
            const rawStudents = students[cls.id] || [];
            rawStudents.forEach(st => {
              if (!classStudentMap[st.rollNo]) {
                classStudentMap[st.rollNo] = st;
              }
            });

            const marks = studentMarks[cls.id] || [];
            marks.forEach(m => classMarksList.push(m));
          });

          const studentList = Object.values(classStudentMap);

          const avgPct = classMarksList.length > 0
            ? Math.round(classMarksList.reduce((sum, r) => sum + r.percentage, 0) / classMarksList.length)
            : null;

          return {
            className,
            primaryClassId: primaryClass.id,
            teacherNames,
            studentList,
            classMarksList,
            scorecardCount: classMarksList.length,
            avgPct
          };
        });

        const activeClassGroup = uniqueScorecardClasses.find(c => c.className === selectedPrincipalMarksClassId);

        return (
          <div className="space-y-6 animate-fade-in">
            
            {/* VIEW 1: UNIFIED CLASS CARDS */}
            {!selectedPrincipalMarksClassId && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-[#1b4d3e]" />
                    <span>Academic Exam Scorecards — Class Wise Overview</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select a class to review student subject marks, class performance, and scorecards.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {uniqueScorecardClasses.map(clsGroup => (
                    <div
                      key={clsGroup.className}
                      className="border border-slate-200 rounded-2xl p-5 hover:border-[#1b4d3e] transition-all bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 bg-emerald-100 text-[#1b4d3e] text-xs font-bold rounded-full mb-1">
                            {clsGroup.className}
                          </span>
                          <div className="text-xs font-bold text-slate-500">
                            Faculty: <span className="text-slate-800">{clsGroup.teacherNames}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                          clsGroup.avgPct !== null ? 'bg-[#1b4d3e] text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {clsGroup.avgPct !== null ? `Avg: ${clsGroup.avgPct}%` : 'Avg: N/A'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-slate-500 flex items-center space-x-2">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{clsGroup.totalStudents} Students • {clsGroup.scorecardCount} Scorecards Available</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPrincipalMarksClassId(clsGroup.className)}
                        className="w-full py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <span>View Student Scorecards</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: CLASS MARKS ROSTER FOR PRINCIPAL */}
            {selectedPrincipalMarksClassId && activeClassGroup && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedPrincipalMarksClassId(null)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Class Exam Scorecards — {activeClassGroup.className}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Faculty: {activeClassGroup.teacherNames} • Overall Class Average: {activeClassGroup.avgPct !== null ? `${activeClassGroup.avgPct}%` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPrincipalMarksClassId(null)}
                    className="text-xs text-[#1b4d3e] font-bold hover:underline cursor-pointer"
                  >
                    ← Back to All Classes
                  </button>
                </div>

                {/* Roster Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="p-3">Roll #</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Exam Name</th>
                        <th className="p-3">Math</th>
                        <th className="p-3">Science</th>
                        <th className="p-3">English</th>
                        <th className="p-3">SS</th>
                        <th className="p-3">Physics</th>
                        <th className="p-3">Total / 500</th>
                        <th className="p-3">Percentage</th>
                        <th className="p-3 text-right">Grade & Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {activeClassGroup.studentList.map(st => {
                        const record = activeClassGroup.classMarksList.find(r => r.rollNo === st.rollNo);

                        return (
                          <tr key={st.rollNo} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">#{st.rollNo}</td>
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <img src={st.photo} alt={st.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                                <span className="font-bold text-slate-900">{st.name}</span>
                              </div>
                            </td>
                            <td className="p-3 font-medium text-slate-600">{record ? record.examName : 'Pending'}</td>
                            <td className="p-3 font-mono">{record?.subjects?.Mathematics ?? '-'}</td>
                            <td className="p-3 font-mono">{record?.subjects?.Science ?? '-'}</td>
                            <td className="p-3 font-mono">{record?.subjects?.English ?? '-'}</td>
                            <td className="p-3 font-mono">{record?.subjects?.SocialStudies ?? '-'}</td>
                            <td className="p-3 font-mono">{record?.subjects?.Physics ?? record?.subjects?.ComputerScience ?? '-'}</td>
                            <td className="p-3 font-mono font-bold text-slate-900">{record ? `${record.totalMarks}` : '-'}</td>
                            <td className="p-3 font-mono font-bold text-[#1b4d3e]">{record ? `${record.percentage}%` : '-'}</td>
                            <td className="p-3 text-right">
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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

    </div>
  );
}
