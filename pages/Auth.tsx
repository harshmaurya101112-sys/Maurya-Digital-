
import React, { useState } from 'react';
import { signupUser, loginUser } from '../firebase';
import { Mail, Lock, User, Phone, ArrowRight, Monitor, AlertCircle, Loader2, Send } from 'lucide-react';

const AuthPage: React.FC<{onAuthSuccess: () => void}> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', mobile: '' });
  const [error, setError] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile: string) => /^[0-9]{10}$/.test(mobile);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        if (!validateEmail(form.email)) throw new Error("कृपया सही ईमेल डालें");
        await loginUser(form.email, form.password);
        onAuthSuccess();
      } else {
        if (!form.name) throw new Error("नाम भरना अनिवार्य है");
        if (!validateEmail(form.email)) throw new Error("ईमेल आईडी सही नहीं है");
        if (!validateMobile(form.mobile)) throw new Error("मोबाइल नंबर 10 अंकों का होना चाहिए");
        if (form.password.length < 6) throw new Error("पासवर्ड कम से कम 6 अंकों का होना चाहिए");
        
        await signupUser(form.name, form.email, form.password, form.mobile);
        setSignedUp(true); // Show check email success state
      }
    } catch (err: any) {
      let msg = err.message || "त्रुटi! दोबारा प्रयास करें";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') msg = "ईमेल या पासवर्ड गलत है";
      if (err.code === 'auth/email-already-in-use') msg = "यह ईमेल पहले से रजिस्टर है";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (signedUp) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[4rem] p-12 text-center shadow-4xl animate-in zoom-in-95 duration-500">
          <div className="bg-emerald-500 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-3xl shadow-emerald-500/30">
            <Send size={44} />
          </div>
          <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter mb-4">Verify Email</h2>
          <p className="text-slate-500 font-bold mb-10 text-sm leading-relaxed">
            हमने <span className="text-blue-600">{form.email}</span> पर एक वेरिफिकेशन लिंक भेजा है। कृपया अपना इनबॉक्स चेक करें और लिंक पर क्लिक करें।
          </p>
          <button 
            onClick={() => { setSignedUp(false); setIsLogin(true); }}
            className="w-full bg-blue-950 text-white py-6 rounded-[1.8rem] font-black uppercase text-xs shadow-3xl hover:bg-black transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-700 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-[4rem] p-10 md:p-14 shadow-4xl relative z-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-orange-500 w-20 h-20 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-3xl shadow-orange-500/30">
            <Monitor size={36} />
          </div>
          <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter leading-none">Maurya Portal</h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">Free & Secure Access</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 text-red-600 text-[10px] font-black rounded-2xl border border-red-100 flex items-start gap-3 animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required 
                  placeholder="Retailer Full Name" 
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:ring-8 focus:ring-blue-500/5 outline-none transition-all" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required 
                  type="tel"
                  maxLength={10}
                  placeholder="Mobile Number" 
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:ring-8 focus:ring-blue-500/5 outline-none transition-all" 
                  value={form.mobile} 
                  onChange={e => setForm({...form, mobile: e.target.value.replace(/\D/g, '')})} 
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="email" 
              required 
              placeholder="Email Address" 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:ring-8 focus:ring-blue-500/5 outline-none transition-all" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="password" 
              required 
              placeholder="Password" 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:ring-8 focus:ring-blue-500/5 outline-none transition-all" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-blue-950 hover:bg-black text-white py-6 rounded-[1.5rem] font-black text-sm uppercase flex items-center justify-center gap-4 transition-all shadow-4xl active:scale-95 disabled:opacity-70 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                {isLogin ? 'Secure Login' : 'Register Account'}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-[9px] font-black text-slate-400 hover:text-blue-900 uppercase tracking-[0.3em] transition-colors"
          >
            {isLogin ? 'New Retailer? Register Here' : 'Existing Merchant? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
