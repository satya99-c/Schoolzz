import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { School, UserCheck, Shield, GraduationCap, LogOut, Building2 } from 'lucide-react';

export default function Navbar({ onSwitchOrg }) {
  const { currentUser, logout, activeSchool } = useAttendance();

  return (
    <header className="sticky top-0 z-40 bg-[#1b4d3e] text-white border-b border-[#143c30] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Active School Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700/60 flex items-center justify-center border border-emerald-400/30 shadow-md">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                Schoolzz
              </span>
              {activeSchool && (
                <span className="hidden sm:inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-500/40 font-mono">
                  {activeSchool.code}
                </span>
              )}
            </div>
            {activeSchool && (
              <p className="text-[11px] text-emerald-200 font-semibold hidden sm:block line-clamp-1">
                {activeSchool.name}
              </p>
            )}
          </div>
        </div>

        {/* Dedicated Portal Badge for Logged-In User ONLY */}
        {currentUser && (
          <div className="flex items-center space-x-2">
            {currentUser.role === 'admin' && (
              <span className="flex items-center space-x-2 bg-slate-800/80 text-white border border-slate-500/40 px-3 py-1 rounded-2xl text-xs font-extrabold shadow-sm">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>School Admin Portal</span>
              </span>
            )}

            {currentUser.role === 'teacher' && (
              <span className="flex items-center space-x-2 bg-emerald-800/60 text-emerald-100 border border-emerald-400/40 px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-sm">
                <UserCheck className="w-4 h-4 text-emerald-300" />
                <span>Teacher Portal</span>
              </span>
            )}

            {currentUser.role === 'principal' && (
              <span className="flex items-center space-x-2 bg-amber-500/20 text-amber-200 border border-amber-400/40 px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-sm">
                <Shield className="w-4 h-4 text-amber-300" />
                <span>Principal Portal</span>
              </span>
            )}

            {currentUser.role === 'student' && (
              <span className="flex items-center space-x-2 bg-teal-800/60 text-teal-100 border border-teal-400/40 px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-sm">
                <GraduationCap className="w-4 h-4 text-teal-300" />
                <span>Student Portal</span>
              </span>
            )}
          </div>
        )}

        {/* User Info & Actions */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <>
              {/* User Profile Pill */}
              <div className="flex items-center space-x-2 bg-[#143c30] px-3 py-1.5 rounded-xl border border-emerald-600/40">
                <span className="text-lg">{currentUser.avatar}</span>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-200 capitalize font-medium">{currentUser.role} Account</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-emerald-100 hover:text-white hover:bg-rose-600/80 rounded-xl transition-all border border-emerald-600/40 hover:border-rose-500 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="text-xs text-emerald-200 font-semibold font-mono bg-emerald-800/60 px-3 py-1 rounded-xl border border-emerald-500/40">
              {activeSchool ? `${activeSchool.name} (${activeSchool.code})` : 'Official School Portal'}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
