import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { UserPlus, X, Check, ShieldAlert } from 'lucide-react';

export default function OnboardTeacherModal({ onClose }) {
  const { onboardTeacher, getNextSequentialId } = useAttendance();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    avatar: '👨‍🏫'
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 50, behavior: 'smooth' });
    if (getNextSequentialId) {
      const nextTId = getNextSequentialId('T');
      setFormData(prev => ({
        ...prev,
        username: nextTId,
        password: nextTId
      }));
    }
  }, [getNextSequentialId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    if (!formData.name || !formData.username || !formData.password) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await onboardTeacher(formData);
      if (result && result.success) {
        onClose();
      } else {
        setError(result?.error || 'Failed to onboard teacher');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Failed to onboard teacher. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 md:pt-10 p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="bg-[#1b4d3e] px-6 py-5 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 flex items-center justify-center text-emerald-200 border border-emerald-400/30">
              <UserPlus className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Onboard New Teacher</h3>
              <p className="text-xs text-emerald-100/90">Register new faculty for class assignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-800/80 text-emerald-100 hover:text-white hover:bg-emerald-700 transition-all cursor-pointer border border-emerald-400/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-2xl flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Teacher Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Rajesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Login Username *</label>
              <input
                type="text"
                required
                placeholder="e.g. teacher4"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Login Password *</label>
              <input
                type="password"
                required
                placeholder="e.g. teacher4"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Avatar Emoji</label>
            <div className="flex space-x-2">
              {['👨‍🏫', '👩‍🏫', '🧑‍🏫', '👨‍🎓', '👩‍🎓'].map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setFormData({ ...formData, avatar: emoji })}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all cursor-pointer ${
                    formData.avatar === emoji
                      ? 'bg-emerald-50 border-2 border-[#1b4d3e] text-[#1b4d3e] scale-105 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Onboard Teacher</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
