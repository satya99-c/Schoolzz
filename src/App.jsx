import React from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import Navbar from './components/Navbar';
import AuthPortal from './portals/AuthPortal';
import TeacherPortal from './portals/TeacherPortal';
import PrincipalPortal from './portals/PrincipalPortal';
import StudentPortal from './portals/StudentPortal';
import WhatsAppModal from './components/WhatsAppModal';
import ApprovalSuccessModal from './components/ApprovalSuccessModal';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

function MainAppContent() {
  const { currentUser, toast } = useAttendance();

  const renderActivePortal = () => {
    if (!currentUser) {
      return <AuthPortal />;
    }

    switch (currentUser.role) {
      case 'teacher':
        return <TeacherPortal />;
      case 'principal':
        return <PrincipalPortal />;
      case 'student':
        return <StudentPortal />;
      default:
        return <AuthPortal />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f2] text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActivePortal()}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short max-w-md">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center space-x-3 text-xs font-semibold backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-emerald-900 border-emerald-500 text-white'
              : toast.type === 'error'
              ? 'bg-rose-900 border-rose-500 text-white'
              : 'bg-[#1b4d3e] border-emerald-400 text-white'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-300 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-emerald-300 flex-shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Principal Approval Success Modal */}
      <ApprovalSuccessModal />

      {/* WhatsApp Modal Preview */}
      <WhatsAppModal />

      {/* Modern Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 space-y-1 shadow-inner">
        <p className="font-semibold text-slate-700">Schoolzz Smart Attendance System &copy; 2026. All rights reserved.</p>
        <p className="text-[10px] text-slate-500">Built with React, Vite, Tailwind CSS & WhatsApp SMS Automation Engine.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AttendanceProvider>
      <MainAppContent />
    </AttendanceProvider>
  );
}
