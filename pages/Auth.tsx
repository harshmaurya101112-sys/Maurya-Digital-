
import React, { useState } from 'react';
import { loginUser, signupUser } from '../firebase';
import { Mail, Lock, User, Phone, ArrowRight, Monitor, AlertCircle, Loader2 } from 'lucide-react';

const AuthPage: React.FC<{onAuthSuccess: () => void}> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', mobile: '' });
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await loginUser(form.email, form.password);
      } else {
        if (!form.name || !form.mobile) {
          throw new Error("कृपया सभी जानकारी भरें");
        }
        await signupUser(form.name, form.email, form.password, form.mobile);
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error("Auth Exception:", err);
      let msg = "प्रमाणीकरण विफल रहा";
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = "ईमेल या पासवर्ड गलत है";
      } else if (err.code === 'auth/email-already-in-use') {
        msg = "यह ईमेल पहले से पंजीकृत है";
      } else if (err.code === 'auth/weak-password') {
        msg = "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए";
      } else if (err.message) {
        msg = err.message;
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-10">
          <div className="bg-orange-500 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-5 shadow-xl shadow-orange-500/30">
            <Monitor size={32} />
          </div>
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter leading-none">Maurya Portal</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Professional Digital Services</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 flex items-center gap-3 animate-shake">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  required 
                  placeholder="पूरा नाम" 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  required 
                  placeholder="मोबाइल नंबर" 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  value={form.mobile} 
                  onChange={e => setForm({...form, mobile: e.target.value})} 
                />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="email" 
              required 
              placeholder="ईमेल एड्रेस" 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="password" 
              required 
              placeholder="पासवर्ड" 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-blue-900 hover:bg-black text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 group transition-all shadow-xl shadow-blue-900/20 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? 'लॉगिन करें' : 'अकाउंट बनाएं'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-[10px] font-black text-slate-500 hover:text-blue-900 uppercase tracking-[0.2em] transition-colors"
          >
            {isLogin ? 'नया अकाउंट चाहिए? यहाँ क्लिक करें' : 'पहले से अकाउंट है? लॉगिन करें'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
