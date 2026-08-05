import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { PlusCircle, X, Check, ShieldAlert, Users, AlertCircle, UserX } from 'lucide-react';

export default function CreateClassModal({ onClose, onOpenOnboardTeacher }) {
  const { teachers, classes, createClassAndStudents } = useAttendance();

  const [step, setStep] = useState(1); // 1: Class & Teacher | 2: Student Roster
  const [error, setError] = useState('');

  const [classData, setClassData] = useState({
    name: 'Class 8 - Section A',
    grade: '8',
    section: 'A',
    shift: 'Morning Section',
    shiftTime: '08:00 AM - 12:00 PM',
    teacherId: ''
  });

  // Pre-populate 15 default students for quick setup
  const [studentList, setStudentList] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      rollNo: i + 1,
      name: `Student ${i + 1}`,
      gender: i % 2 === 0 ? 'Female' : 'Male',
      parentPhone: `+91 98000 ${String(i + 1).padStart(5, '0')}`,
      photo: i % 2 === 0
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      attendancePct: 90,
      daysPresent: 23,
      daysAbsent: 1.5,
      daysLeave: 0.5,
      prePlannedLeave: false
    }))
  );

  // Check teacher occupancy (1 Teacher -> 1 Class Section only)
  const teacherOccupancy = teachers.map(t => {
    const assignedCount = t.assignedClasses ? t.assignedClasses.length : 0;
    const isOccupied = assignedCount >= 1;
    return {
      ...t,
      assignedCount,
      isOccupied
    };
  });

  const availableTeachers = teacherOccupancy.filter(t => !t.isOccupied);

  const handleStudentChange = (index, field, value) => {
    const updated = [...studentList];
    updated[index][field] = value;
    setStudentList(updated);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!classData.name || !classData.teacherId) {
      setError('Please select a Class Teacher before proceeding.');
      return;
    }
    
    // Double check selected teacher
    const selTeacher = teacherOccupancy.find(t => t.id === classData.teacherId);
    if (selTeacher?.isOccupied) {
      setError(`Teacher ${selTeacher.name} is already assigned to another class section. Per policy, 1 teacher can only be assigned to 1 class. Please select an available teacher or onboard a new teacher.`);
      return;
    }

    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createClassAndStudents(classData, studentList);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to create class');
    }
  };

  React.useEffect(() => {
    window.scrollTo({ top: 50, behavior: 'smooth' });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 md:pt-10 p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden space-y-6 my-8">
        
        {/* Header */}
        <div className="bg-[#1b4d3e] px-6 py-5 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 flex items-center justify-center text-emerald-200 border border-emerald-400/30">
              <PlusCircle className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Create New Class & Roster</h3>
              <p className="text-xs text-emerald-100/90">Step {step} of 2 • {step === 1 ? 'Class & Teacher Assignment' : '15 Students Enrollment'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-800/80 text-emerald-100 hover:text-white hover:bg-emerald-700 transition-all cursor-pointer border border-emerald-400/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-2xl flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CLASS DETAILS & TEACHER OCCUPANCY ASSIGNMENT */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="px-6 pb-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Class Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 8 - Section A"
                  value={classData.name}
                  onChange={(e) => setClassData({ ...classData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Shift Section *</label>
                <select
                  value={classData.shift}
                  onChange={(e) => setClassData({
                    ...classData,
                    shift: e.target.value,
                    shiftTime: e.target.value === 'Morning Section' ? '08:00 AM - 12:00 PM' : '12:30 PM - 04:30 PM'
                  })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                >
                  <option value="Morning Section">Morning Section (08:00 AM - 12:00 PM)</option>
                  <option value="Afternoon Section">Afternoon Section (12:30 PM - 04:30 PM)</option>
                </select>
              </div>
            </div>

            {/* TEACHER ASSIGNMENT WITH OCCUPANCY CHECK */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Assign Class Teacher *
                </label>
                <button
                  type="button"
                  onClick={onOpenOnboardTeacher}
                  className="text-xs text-[#1b4d3e] font-bold hover:underline"
                >
                  + Onboard New Teacher
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {teacherOccupancy.map(teacher => (
                  <div
                    key={teacher.id}
                    onClick={() => {
                      if (!teacher.isOccupied) {
                        setClassData({ ...classData, teacherId: teacher.id });
                        setError('');
                      } else {
                        setError(`Teacher ${teacher.name} is already assigned to a class section! Per policy, 1 teacher can only be assigned to 1 class.`);
                      }
                    }}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                      teacher.isOccupied
                        ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                        : classData.teacherId === teacher.id
                        ? 'bg-emerald-50 border-2 border-[#1b4d3e] text-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{teacher.avatar}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{teacher.name}</div>
                        <div className="text-[10px] text-slate-500">
                          Username: <span className="font-mono text-[#1b4d3e] font-bold">{teacher.username}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {teacher.isOccupied ? (
                        <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                          <UserX className="w-3 h-3 text-rose-600" />
                          <span>ASSIGNED (1/1 Class)</span>
                        </span>
                      ) : (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          classData.teacherId === teacher.id
                            ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] font-extrabold'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}>
                          {classData.teacherId === teacher.id ? '✓ Selected' : 'Available (Unassigned)'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {availableTeachers.length === 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>All existing teachers are occupied with max classes!</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenOnboardTeacher}
                    className="bg-[#1b4d3e] text-white text-[11px] font-bold px-3 py-1 rounded-xl"
                  >
                    Onboard Teacher
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={!classData.teacherId}
                className="px-6 py-2.5 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                Proceed to Add 15 Students ➔
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: ENROLL 15 STUDENTS */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#1b4d3e]">
                <Users className="w-4 h-4" />
                <span>15 Students Enrolled for {classData.name} ({classData.shift.split(' ')[0]})</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Roll #1 to #15</span>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {studentList.map((st, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs">
                  <div className="col-span-1 text-center font-bold text-[#1b4d3e] font-mono">
                    #{st.rollNo}
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="Student Name"
                      value={st.name}
                      onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={st.gender}
                      onChange={(e) => handleStudentChange(idx, 'gender', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="Parent Mobile"
                      value={st.parentPhone}
                      onChange={(e) => handleStudentChange(idx, 'parentPhone', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#1b4d3e] font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                🠔 Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Save & Create Class in Database</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
