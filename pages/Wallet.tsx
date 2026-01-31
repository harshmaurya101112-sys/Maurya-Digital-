
import React, { useState, useEffect } from 'react';
import { UserProfile, Transaction } from '../types';
import { Wallet, Plus, ShieldCheck, History, ArrowUpRight, ArrowDownLeft, Loader2, CheckCircle, Lock } from 'lucide-react';
import { updateWalletOnDB, processSecurePayment, setWalletPinDB, db, collection, onSnapshot } from '../firebase';

const WalletPage: React.FC<{user: UserProfile}> = ({ user }) => {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users", user.uid, "history"), (snap: any) => {
      const txs = snap.docs.map((d: any) => d.data() as Transaction);
      setHistory(txs);
    });
    return () => unsub();
  }, [user.uid]);

  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) return alert("कृपया सही राशि डालें");
    setLoading(true);
    try {
      const success = await processSecurePayment(Number(amount));
      if (success) {
        await updateWalletOnDB(user.uid, Number(amount), 'Wallet Deposit', 'credit');
        alert("पेमेंट सफल! बैलेंस अपडेट कर दिया गया है।");
        setAmount('');
      }
    } catch (e: any) {
      alert("पेमेंट फेल: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPin = async () => {
    if (newPin.length < 4) return alert("पिन कम से कम 4 अंकों का होना चाहिए");
    setPinLoading(true);
    try {
      await setWalletPinDB(user.uid, newPin);
      alert("वॉलेट पिन सफलतापूर्वक सेट हो गया!");
      setShowPinDialog(false);
      setNewPin('');
    } catch (e: any) {
      console.error("PIN Set Error:", e);
      alert("पिन सेट करने में त्रुटि: " + (e.message || "Unauthorized"));
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                  <Wallet size={32} className="text-orange-400" />
                </div>
                <button 
                  onClick={() => setShowPinDialog(true)} 
                  className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all ${user.walletPin ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-orange-500 text-white animate-pulse'}`}
                >
                  {user.walletPin ? 'Change Security PIN' : 'Set Security PIN'}
                </button>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-2">Available Balance</p>
              <h1 className="text-6xl font-black mb-1">₹{user.walletBalance.toLocaleString('hi-IN')}</h1>
              <p className="text-xs font-bold text-blue-400 opacity-60">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 uppercase text-xs mb-6 flex items-center gap-2">
              <Plus className="text-green-600" size={16} /> Add Funds to Wallet
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                <input 
                  type="number" 
                  placeholder="Enter Amount" 
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-lg outline-none focus:border-blue-500 transition-all"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAddMoney}
                disabled={loading}
                className="bg-blue-900 hover:bg-black text-white px-10 py-5 md:py-0 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-blue-900/10"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                Add Money
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {[500, 1000, 2000, 5000].map(val => (
                <button key={val} onClick={() => setAmount(val.toString())} className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-[10px] font-black text-slate-600 rounded-lg transition-colors">
                  +₹{val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PIN Security Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-900 uppercase text-xs mb-6 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={16} /> Wallet Security
            </h3>
            <div className="space-y-4">
              <div className={`p-6 rounded-3xl flex items-center gap-4 ${user.walletPin ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                <div className={`${user.walletPin ? 'bg-emerald-600' : 'bg-red-600'} text-white p-3 rounded-2xl shadow-lg`}>
                  {user.walletPin ? <Lock size={20} /> : <ShieldCheck size={20} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-900">PIN Status</p>
                  <p className="text-xs font-black text-slate-500">{user.walletPin ? 'SECURE (PIN SET)' : 'UNPROTECTED'}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPinDialog(true)} 
                className="w-full py-5 border-2 border-dashed border-slate-200 rounded-3xl text-[10px] font-black uppercase text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                Manage Wallet PIN
              </button>
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-[2rem] mt-6">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Security Standard</p>
            <p className="text-[10px] font-bold text-blue-900 leading-relaxed italic">"PIN use karne se aapka wallet kisi bhi unauthorized transaction se bacha rehta hai."</p>
          </div>
        </div>

      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black text-slate-900 uppercase text-xs flex items-center gap-2">
            <History className="text-orange-500" size={16} /> Recent Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-black text-slate-400 uppercase">
                <th className="px-8 py-4">Service</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-right">Amount</th>
                <th className="px-8 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length > 0 ? history.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <span className="text-xs font-black text-slate-900">{tx.serviceName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-bold text-slate-400">{tx.date}</td>
                  <td className={`px-8 py-6 text-right text-xs font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString('hi-IN')}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-full uppercase tracking-widest">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PIN Dialog */}
      {showPinDialog && (
        <div className="fixed inset-0 z-[500] bg-blue-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-12 shadow-4xl animate-in zoom-in-95 duration-200 border-t-[0.5rem] border-orange-500">
            <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight mb-2">Configure PIN</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Protect your wallet funds</p>
            <div className="relative mb-8">
              <input 
                type="password" 
                maxLength={6} 
                placeholder="4-6 Digit PIN" 
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center font-black text-3xl tracking-[0.5em] outline-none focus:border-blue-500 shadow-inner"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowPinDialog(false)} 
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSetPin} 
                disabled={pinLoading}
                className="flex-1 py-4 bg-blue-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {pinLoading ? <Loader2 className="animate-spin" size={14} /> : 'Save PIN'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
