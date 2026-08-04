import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { School, User, KeyRound, UserCheck, Shield, GraduationCap, ArrowRight } from 'lucide-react';

export default function AuthPortal() {
  const { login } = useAttendance();
  const [username, setUsername] = useState('teacher1');
  const [password, setPassword] = useState('teacher1');
  const [activeTab, setActiveTab] = useState('teacher');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  const handleQuickLogin = (roleUser, rolePass, roleName) => {
    setUsername(roleUser);
    setPassword(rolePass);
    setActiveTab(roleName);
    login(roleUser, rolePass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Decorative Green Banner Bar */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#1b4d3e] via-emerald-600 to-[#143c30]"></div>

        {/* Brand Header */}
        <div className="text-center mb-8 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-[#1b4d3e] flex items-center justify-center shadow-lg shadow-emerald-900/20 mx-auto mb-4 border border-emerald-500/30">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Schoolzz Portal Login</h1>
          <p className="text-xs text-slate-500 mt-1">Smart School Attendance & Performance Analytics System</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setUsername('teacher1');
              setPassword('teacher1');
            }}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'teacher'
                ? 'bg-[#1b4d3e] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Teachers</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('principal');
              setUsername('principal');
              setPassword('principal');
            }}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'principal'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Principal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setUsername('student');
              setPassword('student');
            }}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'student'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
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
            className="w-full py-3 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 mt-6 cursor-pointer"
          >
            <span>Sign In to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Quick Credentials Pills */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
            Demo Portal Credentials (Click to Login)
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              onClick={() => handleQuickLogin('teacher1', 'teacher1', 'teacher')}
              className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition-all text-center"
            >
              <div className="font-bold">Teacher 1</div>
              <div className="text-[9px] text-emerald-700 font-mono">teacher1</div>
            </button>

            <button
              onClick={() => handleQuickLogin('principal', 'principal', 'principal')}
              className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-all text-center"
            >
              <div className="font-bold">Principal</div>
              <div className="text-[9px] text-amber-700 font-mono">principal</div>
            </button>

            <button
              onClick={() => handleQuickLogin('student', 'student', 'student')}
              className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100 transition-all text-center"
            >
              <div className="font-bold">Student</div>
              <div className="text-[9px] text-teal-700 font-mono">student</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
