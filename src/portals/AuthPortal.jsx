import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { School, User, KeyRound, UserCheck, Shield, GraduationCap, ArrowRight, Building2, ArrowLeft, Info } from 'lucide-react';

export default function AuthPortal({ onSwitchOrg }) {
  const { login, activeSchool } = useAttendance();
  const [activeTab, setActiveTab] = useState('teacher');
  const [username, setUsername] = useState('teacher1');
  const [password, setPassword] = useState('teacher1');

  const schoolCode = activeSchool?.code || 'SCH1';
  const schoolName = activeSchool?.name || 'Sunshine International School';
  const isAdminDemo = schoolCode === 'SCH2';

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, activeTab);
  };

  const handleTabChange = (role) => {
    setActiveTab(role);
    if (role === 'admin') {
      setUsername(activeSchool?.adminEmail || `admin@${schoolCode.toLowerCase()}.edu`);
      setPassword(activeSchool?.adminPassword || 'admin123');
    } else if (role === 'teacher') {
      setUsername('teacher1');
      setPassword('teacher1');
    } else if (role === 'principal') {
      setUsername(schoolCode === 'SCH1' ? 'principal' : `principal_${schoolCode.toLowerCase()}`);
      setPassword(schoolCode === 'SCH1' ? 'principal' : 'principal123');
    } else if (role === 'student') {
      const demoStudentId = `${schoolCode}-STU-1`;
      setUsername(demoStudentId);
      setPassword(demoStudentId);
    }
  };

  const handleQuickLogin = (roleUser, rolePass, roleName) => {
    setUsername(roleUser);
    setPassword(rolePass);
    setActiveTab(roleName);
    login(roleUser, rolePass, roleName);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Top Decorative Green Banner Bar */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#1b4d3e] via-emerald-600 to-[#143c30]"></div>

        {/* Selected School Header Bar */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-3 mt-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#1b4d3e] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            <School className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#1b4d3e] uppercase tracking-wider block">Official School Portal</span>
            <h2 className="text-sm font-black text-slate-900 leading-tight">{schoolName} ({schoolCode})</h2>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center pt-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Portal Sign In</h1>
          <p className="text-xs text-slate-500 mt-1">Select your role to access attendance, marks & analytics</p>
        </div>

        {/* Role Selector Tabs (4 Roles: Admin, Teacher, Principal, Student) */}
        <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`py-2 rounded-xl font-extrabold transition-all flex flex-col items-center justify-center space-y-0.5 ${
              activeTab === 'admin' ? 'bg-[#1b4d3e] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('principal')}
            className={`py-2 rounded-xl font-extrabold transition-all flex flex-col items-center justify-center space-y-0.5 ${
              activeTab === 'principal' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px]">Principal</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('teacher')}
            className={`py-2 rounded-xl font-extrabold transition-all flex flex-col items-center justify-center space-y-0.5 ${
              activeTab === 'teacher' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="text-[10px]">Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('student')}
            className={`py-2 rounded-xl font-extrabold transition-all flex flex-col items-center justify-center space-y-0.5 ${
              activeTab === 'student' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="text-[10px]">Student</span>
          </button>
        </div>

        {/* Dynamic Help Text per Role */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[11px] text-slate-600 font-medium flex items-start space-x-2">
          <Info className="w-4 h-4 text-[#1b4d3e] flex-shrink-0 mt-0.5" />
          {activeTab === 'admin' && (
            <span>School Admin registers the school, manages shareable links, and creates the Principal account.</span>
          )}
          {activeTab === 'principal' && (
            <span>Principal manages faculty onboarding, class assignments, attendance approvals & student credentials.</span>
          )}
          {activeTab === 'teacher' && (
            <span>Teachers mark daily attendance, create exam rosters, and input student subject marks.</span>
          )}
          {activeTab === 'student' && (
            <span>Students log in using their unique <strong>Student ID</strong> (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">{schoolCode}-STU-1</code>) as both Username & Password.</span>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {activeTab === 'student' ? 'Student ID / Username' : activeTab === 'admin' ? 'Admin Email' : 'Username'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeTab === 'student' ? `e.g. ${schoolCode}-STU-1` : 'Enter username'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password / Passcode</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 mt-6 cursor-pointer"
          >
            <span>Sign In to {schoolCode} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Quick Credentials Pills */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            Demo Credentials for {schoolCode} (Click to Auto-fill)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            <button
              onClick={() => handleQuickLogin(activeSchool?.adminEmail || `admin@${schoolCode.toLowerCase()}.edu`, activeSchool?.adminPassword || 'admin123', 'admin')}
              className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 hover:bg-slate-200 transition-all text-center"
            >
              <div className="font-bold">Admin</div>
              <div className="text-[9px] text-slate-600 font-mono truncate">{activeSchool?.adminEmail || 'admin'}</div>
            </button>

            <button
              onClick={() => handleQuickLogin(schoolCode === 'SCH1' ? 'principal' : `principal_${schoolCode.toLowerCase()}`, 'principal123', 'principal')}
              className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-all text-center"
            >
              <div className="font-bold">Principal</div>
              <div className="text-[9px] text-amber-700 font-mono truncate">{schoolCode === 'SCH1' ? 'principal' : `principal_${schoolCode.toLowerCase()}`}</div>
            </button>

            <button
              onClick={() => handleQuickLogin('teacher1', 'teacher1', 'teacher')}
              className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition-all text-center"
            >
              <div className="font-bold">Teacher</div>
              <div className="text-[9px] text-emerald-700 font-mono">teacher1</div>
            </button>

            <button
              onClick={() => handleQuickLogin(`${schoolCode}-STU-1`, `${schoolCode}-STU-1`, 'student')}
              className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100 transition-all text-center"
            >
              <div className="font-bold">Student ID</div>
              <div className="text-[9px] text-teal-700 font-mono truncate">{schoolCode}-STU-1</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
