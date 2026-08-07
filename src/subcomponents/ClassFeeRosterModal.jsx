import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, Clock, Search, Send, Download, ShieldCheck, DollarSign } from 'lucide-react';

export default function ClassFeeRosterModal({ classId, className, studentList = [], feeRecords = [], onClose, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Combine student information with fee records
  const combinedFeeList = studentList.map(st => {
    const feeObj = feeRecords.find(f => f.rollNo === st.rollNo) || {
      rollNo: st.rollNo,
      totalFee: 45000,
      tuitionFee: 30000,
      examFee: 5000,
      labFee: 6000,
      libraryFee: 4000,
      paidAmount: 30000,
      dueAmount: 15000,
      status: 'DUE',
      dueDate: '15 Aug 2026'
    };

    return {
      ...st,
      ...feeObj
    };
  });

  const filteredList = combinedFeeList.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || String(item.rollNo).includes(q);
    }
    return true;
  });

  const totalReceivables = combinedFeeList.reduce((sum, f) => sum + (f.totalFee || 45000), 0);
  const totalCollected = combinedFeeList.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const totalDue = combinedFeeList.reduce((sum, f) => sum + (f.dueAmount || 0), 0);
  const paidCount = combinedFeeList.filter(f => f.status === 'PAID').length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up my-8">
        
        {/* Header */}
        <div className="bg-[#1b4d3e] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-200 flex items-center justify-center border border-emerald-600">
              <CreditCard className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md mb-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Class Teacher Financial Roster</span>
              </div>
              <h3 className="text-base font-black text-white">{className} • Student Fee & Payment Details</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 hover:bg-emerald-700 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Class Receivables</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">₹{totalReceivables.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-500 font-medium">{studentList.length} Students Enrolled</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Collected Amount</span>
              <div className="text-xl font-black text-emerald-800 mt-0.5">₹{totalCollected.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-700 font-medium">✓ {paidCount} / {studentList.length} Fully Paid</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Outstanding Due</span>
              <div className="text-xl font-black text-amber-900 mt-0.5">₹{totalDue.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-amber-800 font-medium">⚠️ {studentList.length - paidCount} Student(s) Due</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or roll #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="all">All Fee Status</option>
                <option value="PAID">Fully Paid</option>
                <option value="DUE">Outstanding Due</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Roll #</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Total Fee</th>
                  <th className="p-3">Paid Amount</th>
                  <th className="p-3">Due Balance</th>
                  <th className="p-3">Payment Status</th>
                  <th className="p-3">Payment Date / Ref</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium bg-white">
                {filteredList.length > 0 ? (
                  filteredList.map(st => (
                    <tr key={st.rollNo} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">#{st.rollNo}</td>
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <img src={st.photo} alt={st.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                          <div>
                            <span className="font-extrabold block text-slate-900">{st.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{st.parentPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">₹{st.totalFee.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono font-bold text-emerald-700">₹{st.paidAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono font-bold text-amber-800">
                        {st.dueAmount > 0 ? `₹${st.dueAmount.toLocaleString('en-IN')}` : '₹0'}
                      </td>
                      <td className="p-3">
                        {st.status === 'PAID' ? (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>PAID</span>
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>DUE</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-xs text-slate-600 font-mono">
                        {st.status === 'PAID' ? (
                          <div>
                            <span className="font-bold text-slate-900 block">{st.paidDate}</span>
                            <span className="text-[10px] text-[#1b4d3e] font-semibold">{st.transactionId}</span>
                          </div>
                        ) : (
                          <span className="text-amber-800 font-medium">Due by {st.dueDate}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {st.status === 'DUE' ? (
                          <button
                            onClick={() => {
                              showToast(`Fee Payment Reminder & WhatsApp Alert sent to ${st.name}'s parent (${st.parentPhone})!`, 'success');
                            }}
                            className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300 transition-all cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                          >
                            <Send className="w-3 h-3 text-amber-700" />
                            <span>Remind Parent</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              showToast(`Digital Fee Receipt for ${st.name} sent to parent (${st.parentPhone})!`, 'success');
                            }}
                            className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1b4d3e] font-bold text-[11px] border border-emerald-300 transition-all cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                          >
                            <Download className="w-3 h-3 text-emerald-700" />
                            <span>Send Receipt</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400 italic">
                      No student records found matching filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#1b4d3e] text-white text-xs font-bold rounded-xl hover:bg-[#143a2f] transition-all cursor-pointer"
          >
            Close Roster
          </button>
        </div>

      </div>
    </div>
  );
}
