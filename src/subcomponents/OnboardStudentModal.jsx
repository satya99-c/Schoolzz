import React, { useState, useEffect } from 'react';
import { X, UserPlus, Upload, ShieldCheck, CheckCircle2, DollarSign, School, FileText, PlusCircle, ArrowLeft, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export default function OnboardStudentModal({ onClose }) {
  const { classes, students, createClassAndStudents, onboardStudent, getNextSequentialId, showToast } = useAttendance();

  // Auto-generated Student ID (S001, S002, S003...)
  const [generatedStudentId, setGeneratedStudentId] = useState('');

  useEffect(() => {
    if (getNextSequentialId) {
      setGeneratedStudentId(getNextSequentialId('S'));
    }
  }, [getNextSequentialId]);

  // Wizard Stepper State: 1 | 2 | 3 | 4
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1: Student Personal Details
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('2014-05-15');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  // CAPACITY RULE: Filter classes that are NOT FULL (capacity < 15 students)
  const availableNonFullClasses = classes.filter(c => {
    const stCount = (students[c.id] || []).length;
    return stCount < 15;
  });

  // Class Selection Mode: 'existing' | 'new_section'
  const [classMode, setClassMode] = useState(availableNonFullClasses.length > 0 ? 'existing' : 'new_section');
  const [selectedClassId, setSelectedClassId] = useState(availableNonFullClasses[0]?.id || '');

  // Auto-calculate next Roll Number based on selected class section
  const calculateAutoRollNo = (clsId, mode) => {
    if (mode === 'new_section') return 1;
    const existingList = students[clsId] || [];
    return existingList.length + 1;
  };

  const [rollNo, setRollNo] = useState(() => calculateAutoRollNo(availableNonFullClasses[0]?.id, availableNonFullClasses.length > 0 ? 'existing' : 'new_section'));

  // Sync rollNo whenever selected class or mode changes
  useEffect(() => {
    setRollNo(calculateAutoRollNo(selectedClassId, classMode));
  }, [selectedClassId, classMode, students]);

  // Keep selectedClassId synced to first available non-full class or auto-switch to new section if all full
  useEffect(() => {
    if (availableNonFullClasses.length > 0) {
      if (!availableNonFullClasses.some(c => c.id === selectedClassId)) {
        setSelectedClassId(availableNonFullClasses[0].id);
      }
    } else {
      setClassMode('new_section');
    }
  }, [classes, students]);

  // New Class Section Fields with Grade Level Lookup
  const gradeOptions = ['Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6', 'Class 5'];
  const [targetGrade, setTargetGrade] = useState('Class 9');

  // Find existing section names for selected grade (e.g. ['Class 9 - Section A', 'Class 9 - Section B'])
  const existingGradeClasses = classes.filter(c => 
    c.name.toLowerCase().includes(targetGrade.toLowerCase())
  );
  const existingSectionNames = existingGradeClasses.map(c => c.name);

  // Auto-suggest next section letter (e.g. if A and B exist, suggest Section C)
  const getSuggestedSection = (existingList) => {
    const letters = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E'];
    for (let l of letters) {
      if (!existingList.some(name => name.toUpperCase().includes(l.toUpperCase()))) {
        return l;
      }
    }
    return `Section ${existingList.length + 1}`;
  };

  const [selectedSectionLetter, setSelectedSectionLetter] = useState(getSuggestedSection(existingSectionNames));

  // Update suggested section letter whenever targetGrade changes
  useEffect(() => {
    const currentExisting = classes
      .filter(c => c.name.toLowerCase().includes(targetGrade.toLowerCase()))
      .map(c => c.name);
    setSelectedSectionLetter(getSuggestedSection(currentExisting));
  }, [targetGrade, classes]);

  const fullNewClassName = `${targetGrade} - ${selectedSectionLetter}`;

  // STEP 3: Financial & Fee Structure
  const [totalFee, setTotalFee] = useState(45000);
  const [discountAmount, setDiscountAmount] = useState(5000);
  const [paymentStatus, setPaymentStatus] = useState('not_paid'); // 'not_paid' | 'pending' | 'paid'

  const netFee = Math.max(0, Number(totalFee) - Number(discountAmount));

  // STEP 4: Documents
  const [photoName, setPhotoName] = useState('');
  const [tcName, setTcName] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoName(file.name);
  };

  const handleTcUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setTcName(file.name);
  };

  // Step Navigation Handlers
  const handleNextStep1 = () => {
    if (!studentName.trim()) {
      showToast('Please enter the student full name.', 'error');
      return;
    }
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    if (classMode === 'existing' && !selectedClassId) {
      showToast('Please select a valid non-full class section.', 'error');
      return;
    }
    if (classMode === 'new_section' && !fullNewClassName.trim()) {
      showToast('Please specify the new class section name.', 'error');
      return;
    }
    setCurrentStep(3);
  };

  const handleNextStep3 = () => {
    setCurrentStep(4);
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();

    let targetClassId = selectedClassId;
    let targetClassName = '';

    if (classMode === 'new_section') {
      // Create new class section in context & local storage
      const createdCls = await createClassAndStudents({
        name: fullNewClassName,
        shift: 'Morning Shift (8:00 AM - 2:00 PM)',
        shiftTime: '8:00 AM - 2:00 PM',
        grade: targetGrade,
        section: selectedSectionLetter
      }, []);
      targetClassId = createdCls.id;
      targetClassName = createdCls.name;
    } else {
      const clsObj = classes.find(c => c.id === selectedClassId);
      targetClassName = clsObj?.name || selectedClassId;
      
      // Strict Check for 15 student limit
      const existingStCount = (students[targetClassId] || []).length;
      if (existingStCount >= 15) {
        showToast(`Cannot add student. ${targetClassName} is full (15/15 capacity reached). Please create a new section.`, 'error');
        setClassMode('new_section');
        return;
      }
    }

    const currentClassList = students[targetClassId] || [];
    const finalRollNo = currentClassList.length + 1; // Auto-populated when student is added to class section
    const finalStudentId = generatedStudentId || `S${String(finalRollNo).padStart(3, '0')}`;

    const newStudentObj = {
      studentId: finalStudentId,
      username: finalStudentId,
      passcode: finalStudentId, // Default password matches Username S001, S002...
      isFirstLogin: true, // Prompts password change on first login
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

    if (onboardStudent) {
      onboardStudent(targetClassId, newStudentObj);
    } else {
      currentClassList.push(newStudentObj);
      try {
        const savedStudents = JSON.parse(localStorage.getItem('schoolzz_students') || '{}');
        savedStudents[targetClassId] = currentClassList;
        localStorage.setItem('schoolzz_students', JSON.stringify(savedStudents));
      } catch (err) {}
      showToast(`🎉 Student ${studentName} onboarded! Login Username: ${finalStudentId} | Default Password: ${finalStudentId}`, 'success');
    }
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

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          
          {/* STEPPER PROGRESS BAR (Pass-Through Wizard) */}
          <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-[11px] font-bold mb-6">
            <div
              onClick={() => setCurrentStep(1)}
              className={`flex items-center justify-center space-x-1 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-[#1b4d3e] text-white shadow-xs font-black'
                  : currentStep > 1
                  ? 'bg-emerald-100 text-[#1b4d3e]'
                  : 'text-slate-500'
              }`}
            >
              <span>1. Details</span>
              {currentStep > 1 && <Check className="w-3 h-3 text-emerald-700" />}
            </div>

            <div
              onClick={() => currentStep > 1 && setCurrentStep(2)}
              className={`flex items-center justify-center space-x-1 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-[#1b4d3e] text-white shadow-xs font-black'
                  : currentStep > 2
                  ? 'bg-emerald-100 text-[#1b4d3e]'
                  : 'text-slate-400'
              }`}
            >
              <span>2. Class</span>
              {currentStep > 2 && <Check className="w-3 h-3 text-emerald-700" />}
            </div>

            <div
              onClick={() => currentStep > 2 && setCurrentStep(3)}
              className={`flex items-center justify-center space-x-1 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                currentStep === 3
                  ? 'bg-[#1b4d3e] text-white shadow-xs font-black'
                  : currentStep > 3
                  ? 'bg-emerald-100 text-[#1b4d3e]'
                  : 'text-slate-400'
              }`}
            >
              <span>3. Fee</span>
              {currentStep > 3 && <Check className="w-3 h-3 text-emerald-700" />}
            </div>

            <div
              onClick={() => currentStep > 3 && setCurrentStep(4)}
              className={`flex items-center justify-center space-x-1 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                currentStep === 4
                  ? 'bg-[#1b4d3e] text-white shadow-xs font-black'
                  : 'text-slate-400'
              }`}
            >
              <span>4. Documents</span>
            </div>
          </div>

          {/* STEP 1: PERSONAL & GUARDIAN DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <UserPlus className="w-4 h-4 text-[#1b4d3e]" />
                  <span>1. Personal & Guardian Details</span>
                </h4>
                <span className="bg-emerald-100 text-[#1b4d3e] border border-emerald-300 font-mono font-black text-[11px] px-3 py-1 rounded-xl shadow-2xs">
                  Student ID & Login Username: {generatedStudentId || 'S001'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Aarav Verma"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID *</label>
                  <input
                    type="text"
                    readOnly
                    value={generatedStudentId || 'S001'}
                    className="w-full bg-emerald-50 border border-emerald-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-black text-[#1b4d3e] focus:outline-none cursor-not-allowed shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Ramesh Verma"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent Contact Mobile</label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="px-5 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Next: Class Section Assignment</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CLASS SECTION ASSIGNMENT */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                <School className="w-4 h-4 text-[#1b4d3e]" />
                <span>2. Class Section Assignment</span>
              </h4>

              <div className="flex items-center space-x-4 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
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
                  <span>+ Create New Class Section</span>
                </label>
              </div>

              {classMode === 'existing' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Target Class Section (Only Classes with Available Seats) *</label>
                  {availableNonFullClasses.length > 0 ? (
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                    >
                      {availableNonFullClasses.map(c => {
                        const stCount = (students[c.id] || []).length;
                        const availableSeats = 15 - stCount;
                        return (
                          <option key={c.id} value={c.id}>
                            {c.name} — Enrolled: {stCount}/15 Students ({availableSeats} Seats Available)
                          </option>
                        );
                      })}
                    </select>
                  ) : classes.length === 0 ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-bold space-y-2">
                      <div className="flex items-center space-x-1.5 text-[#1b4d3e] text-sm font-black">
                        <School className="w-4.5 h-4.5 text-[#1b4d3e]" />
                        <span>No Existing Class Sections Created Yet</span>
                      </div>
                      <p className="text-[11px] text-emerald-900 font-medium">
                        Your school organization has no existing class sections yet. Please select <strong>"+ Create New Class Section"</strong> above to create the first section for this student.
                      </p>
                      <button
                        type="button"
                        onClick={() => setClassMode('new_section')}
                        className="px-3.5 py-1.5 bg-[#1b4d3e] text-white hover:bg-[#143c30] rounded-xl font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        + Create First Class Section
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs font-bold space-y-2">
                      <div className="flex items-center space-x-1.5 text-amber-900 text-sm font-black">
                        <AlertTriangle className="w-4.5 h-4.5 text-amber-700" />
                        <span>All Existing Class Sections are Full (15/15 Capacity Reached)!</span>
                      </div>
                      <p className="text-[11px] text-amber-800 font-normal">
                        No 16th student can be added to existing classes. Please select <strong>"+ Create New Class Section"</strong> below to create a new section for this student.
                      </p>
                      <button
                        type="button"
                        onClick={() => setClassMode('new_section')}
                        className="px-3.5 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        + Switch to Create New Section
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900 flex items-center space-x-1">
                      <PlusCircle className="w-4 h-4 text-emerald-700" />
                      <span>Create New Section & Assign Student</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                      Smart Section Auto-Lookup
                    </span>
                  </div>

                  {/* Existing Sections Lookup Badge Bar */}
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      Sections already available in {targetGrade}:
                    </span>
                    {existingSectionNames.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {existingSectionNames.map(name => (
                          <span key={name} className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-2xs">
                            ✓ {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">No sections currently exist for {targetGrade}.</span>
                    )}
                  </div>

                  {/* Section Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Select Grade Level *</label>
                      <select
                        value={targetGrade}
                        onChange={(e) => setTargetGrade(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                      >
                        {gradeOptions.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">New Section Letter *</label>
                      <select
                        value={selectedSectionLetter}
                        onChange={(e) => setSelectedSectionLetter(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                      >
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                        <option value="Section C">Section C (Recommended)</option>
                        <option value="Section D">Section D</option>
                        <option value="Section E">Section E</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-emerald-300 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>Resulting New Section Name:</span>
                    <span className="text-sm font-black text-[#1b4d3e] bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">
                      {fullNewClassName}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="px-5 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Next: Fee Structure</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FEE STRUCTURE & DISCOUNT CONCESSION */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                <DollarSign className="w-4 h-4 text-[#1b4d3e]" />
                <span>3. Fee Structure & Discount Concession</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Fee Amount (₹)</label>
                  <input
                    type="number"
                    value={totalFee}
                    onChange={(e) => setTotalFee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scholarship / Discount (₹)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-emerald-800 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                  >
                    <option value="not_paid">Not Paid</option>
                    <option value="pending">Due / Pending</option>
                    <option value="paid">Paid (Fully Cleared)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-extrabold text-emerald-900 shadow-2xs">
                <span>Net Fee Payable Amount:</span>
                <span className="text-base text-[#1b4d3e] font-black">₹{netFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep3}
                  className="px-5 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Next: Document Uploads</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DOCUMENT UPLOADS & FINAL SUBMISSION */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmitFinal} className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                <FileText className="w-4 h-4 text-[#1b4d3e]" />
                <span>4. Document Uploads</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50 space-y-2">
                  <span className="font-bold text-slate-700 block">Student Photo / Identity Proof</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePhotoUpload}
                    className="text-[11px] text-slate-500 cursor-pointer"
                  />
                  {photoName && <p className="text-[10px] text-emerald-700 font-bold">✓ Uploaded: {photoName}</p>}
                </div>

                <div className="p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50 space-y-2">
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

              {/* Summary Overview Before Submission */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-1.5">
                <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">Enrollment Overview:</span>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>Student: <strong className="text-slate-900">{studentName}</strong></div>
                  <div>Class: <strong className="text-[#1b4d3e]">{classMode === 'new_section' ? fullNewClassName : classes.find(c => c.id === selectedClassId)?.name}</strong></div>
                  <div>Parent: <strong className="text-slate-900">{parentName || 'Guardian'}</strong></div>
                  <div>Net Fee: <strong className="text-emerald-700">₹{netFee.toLocaleString('en-IN')}</strong></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>🎓 Complete Student Onboarding</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
