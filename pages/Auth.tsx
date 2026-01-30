
import React, { useState } from 'react';
import { loginUser, signupUser } from '../firebase';
import { Mail, Lock, User, Phone, ArrowRight, Monitor } from 'lucide-react';

const AuthPage: React.FC<{onAuthSuccess: () => void}> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', mobile: '' });
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await loginUser(form.email, form.password);
      } else {
        await signupUser(form.name, form.email, form.password, form.mobile);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError("प्रमाणीकरण विफल: " + (err.message.includes('auth/') ? 'विवरण गलत हैं' : err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <Monitor size={32} />
          </div>
          <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">Maurya Portal</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Digital Services Gateway</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required placeholder="पूरा नाम" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required placeholder="मोबाइल नंबर" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="email" required placeholder="ईमेल" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" 
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="password" required placeholder="पासवर्ड" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" 
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>

          <button disabled={loading} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 group transition-all shadow-xl shadow-blue-900/20">
            {loading ? 'प्रक्रिया जारी...' : (isLogin ? 'लॉगिन' : 'अकाउंट बनाएं')}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'नया अकाउंट? यहाँ क्लिक करें' : 'पहले से अकाउंट है? लॉगिन करें'}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
