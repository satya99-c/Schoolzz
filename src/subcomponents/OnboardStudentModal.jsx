import React, { useState } from 'react';
import { X, UserPlus, Upload, ShieldCheck, CheckCircle2, DollarSign, School, FileText, PlusCircle, AlertCircle } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function OnboardStudentModal({ onClose }) {
  const { classes, students, createClassAndStudents, showToast } = useAttendance();

  // Student Basic Info
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('2014-05-15');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  // Class Selection Mode: 'existing' | 'new_section'
  const [classMode, setClassMode] = useState('existing');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '10-A_morning');

  // New Class Section Fields (if creating new section)
  const [newClassName, setNewClassName] = useState('');
  const [newClassShift, setNewClassShift] = useState('Morning Section');

  // Financial & Fee Structure
  const [totalFee, setTotalFee] = useState(45000);
  const [discountAmount, setDiscountAmount] = useState(5000);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' | 'paid'

  // Documents
  const [photoName, setPhotoName] = useState('');
  const [tcName, setTcName] = useState('');

  // Computed net fee
  const netFee = Math.max(0, Number(totalFee) - Number(discountAmount));

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoName(file.name);
  };

  const handleTcUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setTcName(file.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentName.trim()) {
      showToast('Please enter the student full name.', 'error');
      return;
    }

    let targetClassId = selectedClassId;
    let targetClassName = '';

    if (classMode === 'new_section') {
      if (!newClassName.trim()) {
        showToast('Please enter a name for the new class section.', 'error');
        return;
      }
      // Create new class section
      const createdCls = createClassAndStudents(newClassName, newClassShift);
      targetClassId = createdCls.id;
      targetClassName = createdCls.name;
    } else {
      const clsObj = classes.find(c => c.id === selectedClassId);
      targetClassName = clsObj?.name || selectedClassId;
    }

    // Auto-assign roll number if empty
    const currentClassList = students[targetClassId] || [];
    const finalRollNo = Number(rollNo) || (currentClassList.length + 1);

    const newStudentObj = {
      rollNo: finalRollNo,
      name: studentName,
      gender,
      dob,
      parentName: parentName || 'Guardian',
      parentPhone: parentPhone || '+91 98765 43210',
      documents: {
        photo: photoName || 'student_photo.jpg',
        tc: tcName || 'birth_certificate.pdf'
      },
      feeInfo: {
        totalFee: Number(totalFee),
        discountAmount: Number(discountAmount),
        netFee,
        status: paymentStatus
      }
    };

    // Add student to context state (or mutate local storage)
    currentClassList.push(newStudentObj);
    try {
      const savedStudents = JSON.parse(localStorage.getItem('schoolzz_students') || '{}');
      savedStudents[targetClassId] = currentClassList;
      localStorage.setItem('schoolzz_students', JSON.stringify(savedStudents));
    } catch (err) {}

    showToast(`🎉 Student ${studentName} onboarded successfully into ${targetClassName}! Net Fee: ₹${netFee.toLocaleString('en-IN')}.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up my-6">
        
        {/* Header */}
        <div className="bg-[#1b4d3e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-200 flex items-center justify-center border border-emerald-600 font-bold text-xl">
              🎓
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md mb-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Student Admission & Enrollment</span>
              </div>
              <h3 className="text-base font-black text-white">Register / Onboard New Student</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 hover:bg-emerald-700 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* SECTION 1: PERSONAL DETAILS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
              <UserPlus className="w-4 h-4 text-[#1b4d3e]" />
              <span>1. Personal & Guardian Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Verma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
                <input
                  type="number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="Auto-assigned if empty"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Ramesh Verma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Contact Mobile</label>
                <input
                  type="text"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: CLASS SECTION ASSIGNMENT */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
              <School className="w-4 h-4 text-[#1b4d3e]" />
              <span>2. Class Section Assignment</span>
            </h4>

            <div className="flex items-center space-x-3 text-xs">
              <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-slate-800">
                <input
                  type="radio"
                  name="classMode"
                  value="existing"
                  checked={classMode === 'existing'}
                  onChange={() => setClassMode('existing')}
                  className="accent-[#1b4d3e]"
                />
                <span>Assign to Existing Class</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-emerald-800">
                <input
                  type="radio"
                  name="classMode"
                  value="new_section"
                  checked={classMode === 'new_section'}
                  onChange={() => setClassMode('new_section')}
                  className="accent-[#1b4d3e]"
                />
                <span>+ Create New Class Section (If all full)</span>
              </label>
            </div>

            {classMode === 'existing' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Target Class Section *</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                >
                  {classes.map(c => {
                    const stCount = (students[c.id] || []).length;
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.shift}) — Enrolled: {stCount} Students
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-emerald-900 flex items-center space-x-1">
                  <PlusCircle className="w-4 h-4 text-emerald-700" />
                  <span>Create New Class Section & Assign Student</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Class Section Name *</label>
                    <input
                      type="text"
                      required={classMode === 'new_section'}
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="e.g. Class 11 - Section A"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Section Shift</label>
                    <select
                      value={newClassShift}
                      onChange={(e) => setNewClassShift(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                    >
                      <option value="Morning Section">Morning Section (08:30 AM)</option>
                      <option value="Afternoon Section">Afternoon Section (01:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: FEE STRUCTURE & CONCESSION DISCOUNT */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
              <DollarSign className="w-4 h-4 text-[#1b4d3e]" />
              <span>3. Fee Structure & Discount Concession</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Fee Amount (₹)</label>
                <input
                  type="number"
                  value={totalFee}
                  onChange={(e) => setTotalFee(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scholarship / Discount (₹)</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-800 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                >
                  <option value="pending">Due / Pending</option>
                  <option value="paid">Paid (Fully Cleared)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-extrabold text-emerald-900">
              <span>Net Fee Payable Amount:</span>
              <span className="text-sm text-[#1b4d3e] font-black">₹{netFee.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* SECTION 4: DOCUMENT UPLOADS */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-[#1b4d3e]" />
              <span>4. Document Uploads</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 space-y-1">
                <span className="font-bold text-slate-700 block">Student Photo / Identity Proof</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handlePhotoUpload}
                  className="text-[11px] text-slate-500 cursor-pointer"
                />
                {photoName && <p className="text-[10px] text-emerald-700 font-bold">✓ Uploaded: {photoName}</p>}
              </div>

              <div className="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 space-y-1">
                <span className="font-bold text-slate-700 block">Birth / Transfer Certificate (TC)</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleTcUpload}
                  className="text-[11px] text-slate-500 cursor-pointer"
                />
                {tcName && <p className="text-[10px] text-emerald-700 font-bold">✓ Uploaded: {tcName}</p>}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Submit & Onboard Student</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
