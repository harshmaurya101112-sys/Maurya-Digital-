
import React, { useState } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap, X, Download, Printer } from 'lucide-react';
import { UserProfile, Transaction } from '../types';

interface WalletPageProps {
  user: UserProfile;
  onAddMoney: (amount: number) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ user, onAddMoney }) => {
  const [addAmount, setAddAmount] = useState('500');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddMoney = () => {
    const amount = parseInt(addAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setIsProcessing(true);
    // Simulation: Wait for 2 seconds to simulate a gateway response
    setTimeout(() => {
      onAddMoney(amount);
      setIsProcessing(false);
      alert(`₹${amount} आपके वॉलेट में जोड़ दिए गए हैं।`);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-tr from-blue-900 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-fit">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Personal Wallet</span>
              <ShieldCheck className="w-6 h-6 opacity-60" />
            </div>
            <div>
              <p className="text-blue-200 text-sm font-bold">कुल बैलेंस (Total Balance)</p>
              <h2 className="text-5xl font-black mt-2">₹{user.walletBalance.toLocaleString('hi-IN')}</h2>
            </div>
            <div className="mt-12 flex justify-between items-end">
              <div>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">VLE Account</p>
                <p className="text-sm font-bold uppercase">{user.displayName}</p>
              </div>
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                <div className="w-8 h-8 rounded-full bg-white/10 -ml-4"></div>
              </div>
            </div>
          </div>
          <Zap className="absolute right-0 top-0 w-64 h-64 -mr-16 -mt-16 text-white/5 pointer-events-none" />
        </div>

        {/* Add Money Form */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-center relative">
          {isProcessing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[2.5rem]">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-black text-sm text-blue-900 animate-pulse">भुगतान प्रक्रिया जारी है...</p>
            </div>
          )}
          <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            पैसे जोड़ें (Add Money)
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {['100', '500', '1000'].map((amt) => (
                <button 
                  key={amt}
                  onClick={() => setAddAmount(amt)}
                  className={`py-3 rounded-2xl font-black text-sm transition-all border ${
                    addAmount === amt 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-blue-200'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input 
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-lg"
                placeholder="Other Amount"
              />
            </div>
            <button 
              onClick={handleAddMoney}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-800/20 transition-all hover:-translate-y-0.5"
            >
              रीचार्ज करें (Pay Securely)
            </button>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-black text-gray-800 mb-8">लेनदेन इतिहास (Transaction History)</h3>
        {user.transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="pb-4 px-4">दिनांक</th>
                  <th className="pb-4 px-4">विवरण</th>
                  <th className="pb-4 px-4">प्रकार</th>
                  <th className="pb-4 px-4 text-right">राशि</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {user.transactions.map((t) => (
                  <tr 
                    key={t.id} 
                    onClick={() => setSelectedTxn(t)}
                    className="text-sm cursor-pointer hover:bg-slate-50 transition-colors group"
                  >
                    <td className="py-5 px-4 font-medium text-gray-500">{t.date}</td>
                    <td className="py-5 px-4">
                      <p className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{t.serviceName}</p>
                      <p className="text-[10px] text-gray-400 uppercase">ID: {t.id}</p>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        t.type === 'debit' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {t.type === 'debit' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {t.type === 'debit' ? 'Debit' : 'Credit'}
                      </span>
                    </td>
                    <td className={`py-5 px-4 text-right font-black ${t.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                      {t.type === 'debit' ? '-' : '+'}₹{t.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="text-xs font-black uppercase tracking-widest">कोई लेनदेन उपलब्ध नहीं</p>
          </div>
        )}
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blue-950/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h4 className="font-black text-blue-900 uppercase tracking-widest text-sm">भुगतान की रसीद</h4>
              <button onClick={() => setSelectedTxn(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center pb-6 border-b border-dashed border-gray-200">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${selectedTxn.type === 'debit' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {selectedTxn.type === 'debit' ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
                </div>
                <h2 className="text-4xl font-black text-gray-900">₹{selectedTxn.amount}</h2>
                <p className={`text-[10px] font-black uppercase mt-1 tracking-widest ${selectedTxn.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                  Transaction {selectedTxn.status}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-bold uppercase">Transaction ID</span>
                  <span className="text-gray-800 font-black">{selectedTxn.id}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-bold uppercase">Date & Time</span>
                  <span className="text-gray-800 font-black">{selectedTxn.date}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-bold uppercase">Service</span>
                  <span className="text-gray-800 font-black">{selectedTxn.serviceName}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between text-xs">
                  <span className="text-gray-400 font-bold uppercase">Previous Balance</span>
                  <span className="text-gray-800 font-black">₹{selectedTxn.prevBalance}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-bold uppercase">New Balance</span>
                  <span className="text-blue-700 font-black">₹{selectedTxn.newBalance}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-gray-700 py-3 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 transition-all">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button className="flex-1 bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
                  <Download className="w-4 h-4" /> PDF
                </button>
              </div>
            </div>
            <div className="bg-slate-900 p-4 text-center">
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Digital Seva Maurya Portal • Powered by Firebase</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
