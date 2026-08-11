import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import OnboardTeacherModal from '../components/OnboardTeacherModal';
import OnboardStudentModal from '../subcomponents/OnboardStudentModal';
import { Building2, Shield, UserPlus, Copy, CheckCircle, School, Users, BookOpen, KeyRound, Mail, Sparkles, User, GraduationCap, ChevronDown, ShieldCheck, PlusCircle } from 'lucide-react';

export default function SchoolAdminPortal() {
  const { activeSchool, teachers, classes, students, getNextSequentialId, showToast } = useAttendance();

  // Selection Dropdown: 'student' | 'teacher' | 'principal'
  const [whomToOnboard, setWhomToOnboard] = useState('student');

  // Modals state
  const [showOnboardStudentModal, setShowOnboardStudentModal] = useState(false);
  const [showOnboardTeacherModal, setShowOnboardTeacherModal] = useState(false);
  
  // Principal Form State
  const [principalName, setPrincipalName] = useState('');
  const [principalEmail, setPrincipalEmail] = useState('');
  const [principalUsername, setPrincipalUsername] = useState('');
  const [principalPassword, setPrincipalPassword] = useState('');

  React.useEffect(() => {
    if (getNextSequentialId) {
      const nextPId = getNextSequentialId('P');
      setPrincipalUsername(nextPId);
      setPrincipalPassword(nextPId);
    }
  }, [getNextSequentialId]);

  const schoolCode = activeSchool?.code || 'SCH2';
  const schoolName = activeSchool?.name || 'Green Valley Academy';
  const originStr = typeof window !== 'undefined' ? window.location.origin : '';
  const shareableUrl = `${originStr}/?school=${schoolCode}`;

  // Count totals
  const totalStudentsCount = Object.values(students).reduce((acc, curr) => acc + (curr?.length || 0), 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    showToast(`Copied shareable school portal link: ${shareableUrl}`, 'success');
  };

  const handleCreatePrincipalSubmit = (e) => {
    e.preventDefault();
    if (!principalName || !principalUsername || !principalPassword) {
      showToast('Please fill out all required Principal details.', 'error');
      return;
    }

    showToast(`Principal Account "${principalName}" (Username: ${principalUsername}) created for ${schoolName}!`, 'success');
    
    // Reset form
    setPrincipalName('');
    setPrincipalEmail('');
    setPrincipalUsername('');
    setPrincipalPassword('principal123');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1b4d3e] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-500/30">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-800 text-emerald-200 border border-emerald-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              School Organization Admin
            </span>
            <span className="bg-white/20 text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              {schoolCode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{schoolName}</h1>
          <p className="text-xs text-emerald-100 font-medium">
            Unified School Onboarding & Administration Hub
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-[#1b4d3e] font-extrabold text-xs shadow-lg flex items-center space-x-2 transition-all cursor-pointer border border-emerald-300"
        >
          <Copy className="w-4 h-4 text-[#1b4d3e]" />
          <span>Copy Shareable School Link</span>
        </button>
      </div>

      {/* Shareable Link Banner Card */}
      <div className="bg-emerald-50 border border-emerald-300 p-4 sm:p-5 rounded-3xl space-y-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-xs font-black text-[#1b4d3e] uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Shareable School Web Portal Link</span>
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Share this unique URL with teachers, principal, students, and staff to log directly into <span className="font-bold text-slate-900">{schoolName}</span>:
          </p>
          <code className="text-xs font-mono font-bold text-[#1b4d3e] bg-white px-3 py-1 rounded-lg border border-emerald-200 block mt-1.5 w-fit">
            {shareableUrl}
          </code>
        </div>

        <button
          onClick={handleCopyLink}
          className="px-4 py-2 rounded-xl bg-[#1b4d3e] text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all cursor-pointer flex-shrink-0"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Link</span>
        </button>
      </div>

      {/* MAIN UNIFIED ONBOARDING CONTROL SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
        
        {/* Onboarding Target Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-[#1b4d3e]" />
              <h2 className="text-lg font-black text-slate-900">School Onboarding Workspace</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">Select whom you want to onboard below to view and fill onboarding details.</p>
          </div>

          {/* DROPDOWN SELECTOR: WHOM TO ONBOARD */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-black text-slate-700 whitespace-nowrap">Whom to Onboard? *</label>
            <select
              value={whomToOnboard}
              onChange={(e) => setWhomToOnboard(e.target.value)}
              className="bg-emerald-50 border border-emerald-300 text-[#1b4d3e] font-black text-xs rounded-xl px-4 py-2.5 shadow-xs focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
            >
              <option value="student">🎓 Onboard / Register New Student</option>
              <option value="teacher">👨‍🏫 Onboard New Faculty Teacher</option>
              <option value="principal">🛡️ Onboard / Create Principal Login Account</option>
            </select>
          </div>
        </div>

        {/* DYNAMIC ONBOARDING DETAILS PANEL BASED ON DROPDOWN SELECTION */}
        
        {/* SELECTION 1: ONBOARD STUDENT */}
        {whomToOnboard === 'student' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="bg-amber-200 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase">
                  Student Enrollment & Admission
                </span>
                <h3 className="text-base font-black text-slate-900">Register / Onboard New Student to School</h3>
                <p className="text-xs text-slate-600">
                  Fill personal details, assign to an existing non-full class section (max 15 students) or auto-create a new class section, configure fee structure with discount concessions, and upload TC/ID documents.
                </p>
              </div>

              <button
                onClick={() => setShowOnboardStudentModal(true)}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-slate-950" />
                <span>🎓 Open Student Onboarding Form (4-Step Wizard)</span>
              </button>
            </div>

            {/* Quick Student & Class Occupancy Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Total Enrolled Students</span>
                <div className="text-xl font-black text-slate-900">{totalStudentsCount} Students</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Class Section Limit</span>
                <div className="text-xl font-black text-[#1b4d3e]">Strict 15 Students / Section</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Active Class Sections</span>
                <div className="text-xl font-black text-slate-900">{classes.length} Class Sections</div>
              </div>
            </div>
          </div>
        )}

        {/* SELECTION 2: ONBOARD FACULTY TEACHER */}
        {whomToOnboard === 'teacher' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="bg-emerald-200 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase">
                  Faculty Recruitment & Onboarding
                </span>
                <h3 className="text-base font-black text-slate-900">Onboard New Faculty Teacher</h3>
                <p className="text-xs text-slate-600">
                  Register new teaching staff for class assignments, set login username & password, and assign avatar emojis.
                </p>
              </div>

              <button
                onClick={() => setShowOnboardTeacherModal(true)}
                className="px-5 py-3 rounded-2xl bg-[#1b4d3e] hover:bg-[#143c30] text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-200" />
                <span>👨‍🏫 Open Teacher Onboarding Form</span>
              </button>
            </div>

            {/* Teacher Roster Summary */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
                Current Onboarded Faculty List ({teachers.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {teachers.map(t => (
                  <div key={t.id} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center space-x-3 text-xs">
                    <span className="text-2xl">{t.avatar || '👨‍🏫'}</span>
                    <div>
                      <h4 className="font-bold text-slate-900">{t.name}</h4>
                      <span className="text-[11px] font-mono text-[#1b4d3e] font-semibold">@{t.username}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SELECTION 3: ONBOARD PRINCIPAL ACCOUNT */}
        {whomToOnboard === 'principal' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Onboard & Create Principal Login Account</h3>
                <p className="text-xs text-slate-500 font-medium">Create credentials for the Principal of {schoolName}</p>
              </div>
            </div>

            <form onSubmit={handleCreatePrincipalSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Principal Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={principalName}
                      onChange={(e) => setPrincipalName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-[#1b4d3e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      placeholder={`principal@${schoolCode.toLowerCase()}.edu`}
                      value={principalEmail}
                      onChange={(e) => setPrincipalEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#1b4d3e]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder={`principal_${schoolCode.toLowerCase()}`}
                      value={principalUsername}
                      onChange={(e) => setPrincipalUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-[#1b4d3e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password *</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={principalPassword}
                      onChange={(e) => setPrincipalPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#1b4d3e]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Create Principal Account</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* Organization Status & Summary Sidebar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center space-x-1.5">
          <Building2 className="w-4 h-4 text-[#1b4d3e]" />
          <span>Organization Overview</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">School Name</span>
            <span className="font-extrabold text-slate-900 text-sm">{schoolName}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">School Code</span>
            <span className="font-mono font-bold text-[#1b4d3e] text-sm">{schoolCode}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Onboarded Faculty</span>
            <span className="font-bold text-slate-900">{teachers.length} Teachers Onboarded</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Classes</span>
            <span className="font-bold text-slate-900">{classes.length} Active Class Sessions</span>
          </div>
        </div>
      </div>

      {/* ONBOARD TEACHER MODAL */}
      {showOnboardTeacherModal && (
        <OnboardTeacherModal
          onClose={() => setShowOnboardTeacherModal(false)}
        />
      )}

      {/* ONBOARD STUDENT MODAL (4-STEP WIZARD) */}
      {showOnboardStudentModal && (
        <OnboardStudentModal
          onClose={() => setShowOnboardStudentModal(false)}
        />
      )}

    </div>
  );
}
