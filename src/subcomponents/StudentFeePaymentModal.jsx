import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, CheckCircle2, ShieldCheck, Download, ArrowRight, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentFeePaymentModal({ student, classId, feeRecord, onPaySuccess, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiApp, setUpiApp] = useState('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const amountToPay = feeRecord?.dueAmount || 15000;

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const methodLabel = paymentMethod === 'upi'
        ? `UPI (${upiApp.toUpperCase()})`
        : paymentMethod === 'card'
        ? 'Credit / Debit Card'
        : 'Net Banking';

      const txnId = `TXN-UPI-${Math.floor(100000 + Math.random() * 900000)}`;

      const newReceipt = {
        receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        transactionId: txnId,
        studentName: student.name,
        rollNo: student.rollNo,
        classId: classId,
        amountPaid: amountToPay,
        paymentMethod: methodLabel,
        paidDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      setReceiptData(newReceipt);
      onPaySuccess({ amount: amountToPay, paymentMethod: methodLabel, txnId });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b4d3e] to-[#256854] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 border border-emerald-400/30 flex items-center justify-center text-emerald-200">
              <CreditCard className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Online Fee Payment</h3>
              <p className="text-xs text-emerald-200 font-medium">Secure Payment Gateway • {student.name} (#{student.rollNo})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {!isCompleted ? (
          <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
            
            {/* Amount Banner */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Outstanding Due Amount</span>
                <div className="text-2xl font-black text-[#1b4d3e]">₹{amountToPay.toLocaleString('en-IN')}</div>
              </div>
              <span className="bg-emerald-100 text-[#1b4d3e] border border-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-bit Encrypted</span>
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select Payment Method *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-md font-extrabold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs">UPI Apps</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-md font-extrabold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-md font-extrabold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs">Net Banking</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {paymentMethod === 'upi' && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 animate-fade-in">
                <label className="block text-xs font-bold text-slate-700">Choose UPI App</label>
                <div className="flex items-center space-x-2">
                  {['gpay', 'phonepe', 'paytm', 'bhim'].map(app => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiApp(app)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase border cursor-pointer ${
                        upiApp === app ? 'bg-[#1b4d3e] text-white border-[#1b4d3e]' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    defaultValue={`${student.name.toLowerCase().replace(/\s+/g, '')}@upi`}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 animate-fade-in text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    defaultValue={student.name}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8912"
                    defaultValue="4532 8910 2341 8912"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      defaultValue="08/29"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      defaultValue="891"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 animate-fade-in text-xs">
                <label className="block font-bold text-slate-700">Select Bank</label>
                <select className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:outline-none">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 bg-[#1b4d3e] hover:bg-[#143a2f] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Pay ₹{amountToPay.toLocaleString('en-IN')} Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Payment Success & Receipt View */
          <div className="p-6 space-y-5 animate-fade-in">
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-[#1b4d3e]">Payment Successful!</h3>
              <p className="text-xs text-emerald-900 font-medium">
                Fee payment of ₹{amountToPay.toLocaleString('en-IN')} has been received and verified.
              </p>
            </div>

            {/* Digital Receipt Box */}
            {receiptData && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-[#1b4d3e]">Schoolzz Digital Fee Receipt</span>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">{receiptData.receiptNo}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                  <div>Student: <strong className="text-slate-900">{receiptData.studentName}</strong></div>
                  <div>Roll #: <strong className="text-slate-900">#{receiptData.rollNo}</strong></div>
                  <div>Payment Date: <strong className="text-slate-900">{receiptData.paidDate}</strong></div>
                  <div>Payment Mode: <strong className="text-slate-900">{receiptData.paymentMethod}</strong></div>
                  <div className="col-span-2">Txn Ref: <strong className="font-mono text-[#1b4d3e]">{receiptData.transactionId}</strong></div>
                </div>

                <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Total Paid Amount:</span>
                  <span className="text-base font-black text-emerald-700">₹{receiptData.amountPaid.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  alert(`Receipt ${receiptData?.receiptNo} downloaded as PDF!`);
                }}
                className="px-4 py-2 bg-emerald-50 text-[#1b4d3e] border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt PDF</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#1b4d3e] text-white rounded-xl text-xs font-bold hover:bg-[#143a2f] transition-all cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
