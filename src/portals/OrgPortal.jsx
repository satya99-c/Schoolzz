import React, { useState } from 'react';
import { useAttendance, getDefaultSchools } from '../context/AttendanceContext';
import { School, PlusCircle, CheckCircle, Copy, ArrowRight, Shield, MapPin, Mail, Sparkles, Building2, User, KeyRound } from 'lucide-react';

export default function OrgPortal({ onSelectSchool }) {
  const { schools = [], activeSchool, selectSchool, registerSchool, showToast } = useAttendance();
  const displaySchools = (schools && Array.isArray(schools) && schools.length > 0) ? schools : getDefaultSchools();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // New School Form State
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  const handleCopyLink = (code, e) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/?school=${code}`;
    navigator.clipboard.writeText(url);
    showToast(`Copied school shareable link: ${url}`, 'success');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!newSchoolName || !newAdminEmail || !newAdminPassword) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const code = newSchoolCode.trim().toUpperCase() || `SCH${schools.length + 1}`;
    
    const createdSchool = registerSchool({
      code,
      name: newSchoolName.trim(),
      city: newCity.trim() || 'Main Campus',
      adminName: newAdminName.trim() || 'School Admin',
      adminEmail: newAdminEmail.trim().toLowerCase(),
      adminPassword: newAdminPassword,
      hasData: false
    });

    setShowRegisterModal(false);
    // Reset form
    setNewSchoolName('');
    setNewSchoolCode('');
    setNewCity('');
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPassword('');

    showToast(`School Organization "${createdSchool.name}" registered successfully!`, 'success');
    if (onSelectSchool) onSelectSchool(createdSchool);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center p-4 sm:p-6">
      
      {/* Container Box */}
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Top Banner Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 border border-emerald-300 text-[#1b4d3e] px-4 py-1.5 rounded-full text-xs font-extrabold shadow-xs">
            <Building2 className="w-4 h-4" />
            <span>Multi-Tenant School Organization Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Select Your School Organization
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
            Choose an existing school to proceed to its dedicated Teachers, Principal & Student portals, or register a new school organization.
          </p>
        </div>

        {/* Action Button: Register New School */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-6 py-3.5 rounded-2xl bg-[#1b4d3e] hover:bg-[#143c30] text-white font-extrabold text-xs shadow-xl flex items-center space-x-2.5 transition-all cursor-pointer hover:scale-105 active:scale-95 border border-emerald-500/30"
          >
            <PlusCircle className="w-5 h-5 text-emerald-300" />
            <span>+ Register New School Organization (School 2, etc.)</span>
          </button>
        </div>

        {/* Schools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySchools.map((sch) => {
            const isSelected = activeSchool?.code === sch.code;
            const originStr = typeof window !== 'undefined' ? window.location.origin : '';
            const shareableUrl = `${originStr}/?school=${sch.code}`;

            return (
              <div
                key={sch.code}
                onClick={() => {
                  selectSchool(sch.code);
                  if (onSelectSchool) onSelectSchool(sch);
                }}
                className={`bg-white border rounded-3xl p-6 shadow-lg space-y-4 relative flex flex-col justify-between transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 ${
                  isSelected
                    ? 'border-2 border-[#1b4d3e] ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full font-mono">
                      CODE: {sch.code}
                    </span>
                    {sch.hasData ? (
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Pre-loaded Demo Data</span>
                      </span>
                    ) : (
                      <span className="bg-teal-100 text-teal-900 border border-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ✓ Registered Organization
                      </span>
                    )}
                  </div>

                  {/* School Title & Icon */}
                  <div className="flex items-start space-x-3 pt-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#1b4d3e] text-white flex items-center justify-center text-xl font-bold shadow-md flex-shrink-0">
                      <School className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                        {sch.name}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center space-x-1 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sch.city || 'Main Campus'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-500 font-medium">School Admin:</span>
                      <span className="font-bold text-slate-900">{sch.adminName || 'Admin'}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-500 font-medium">Admin Email:</span>
                      <span className="font-mono text-[11px] text-[#1b4d3e] font-semibold">{sch.adminEmail || `admin@${sch.code.toLowerCase()}.edu`}</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all ${
                      isSelected
                        ? 'bg-[#1b4d3e] text-white shadow-md'
                        : 'bg-emerald-50 text-[#1b4d3e] hover:bg-[#1b4d3e] hover:text-white border border-emerald-300'
                    }`}
                  >
                    <span>Enter School Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(sch.code, e)}
                    className="w-full py-1.5 px-3 text-[11px] font-semibold text-slate-600 hover:text-[#1b4d3e] hover:bg-slate-100 rounded-lg flex items-center justify-center space-x-1 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Shareable School Link</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* REGISTER NEW SCHOOL MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b4d3e] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Register New School</h3>
                  <p className="text-xs text-slate-500 font-medium">Create a new organization workspace (e.g. School 2)</p>
                </div>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">School Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Valley Academy (School 2)"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">School Code (Short Tag)</label>
                  <input
                    type="text"
                    placeholder="e.g. SCH2"
                    value={newSchoolCode}
                    onChange={(e) => setNewSchoolCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai / Delhi"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-3">
                <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">School Admin Credentials</span>
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admin Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. School 2 Admin"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admin Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@greenvalley.edu"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admin Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white font-extrabold shadow-lg transition-all flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>Register School & Login</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
