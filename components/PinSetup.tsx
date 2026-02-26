
import React, { useState } from 'react';
import { Lock, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { setWalletPinDB } from '../firebase';

interface PinSetupProps {
  uid: string;
  onComplete: () => void;
}

const PinSetup: React.FC<PinSetupProps> = ({ uid, onComplete }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError('PIN must be 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    try {
      await setWalletPinDB(uid, pin);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to set PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-4xl p-10 border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-900/20">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Secure Your Wallet</h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-2">Set a 4-digit transaction PIN</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase flex items-center gap-3">
            <ShieldCheck size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSetPin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">New 4-Digit PIN</label>
            <input 
              type="password" 
              maxLength={4}
              placeholder="••••"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-2xl text-center tracking-[1em] outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm PIN</label>
            <input 
              type="password" 
              maxLength={4}
              placeholder="••••"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-2xl text-center tracking-[1em] outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Activate Wallet'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-8 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
          This PIN will be required for all transactions. <br/> Keep it secret and secure.
        </p>
      </div>
    </div>
  );
};

export default PinSetup;
