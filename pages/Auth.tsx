
import React, { useState, useEffect } from 'react';
import { auth, signupUser, loginUser } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { Mail, Lock, User, Phone, ArrowRight, Monitor, AlertCircle, Loader2, ShieldCheck, CheckCircle } from 'lucide-react';

const AuthPage: React.FC<{onAuthSuccess: () => void}> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', mobile: '', otp: '' });
  const [error, setError] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile: string) => /^[0-9]{10}$/.test(mobile);

  useEffect(() => {
    if (!isLogin && !(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          'callback': () => { console.debug('reCAPTCHA verified'); }
        });
      } catch (e) {
        console.error("Recaptcha error:", e);
      }
    }
  }, [isLogin]);

  const handleSendOTP = async () => {
    if (!validateMobile(form.mobile)) {
      setError("कृपया 10 अंकों का सही मोबाइल नंबर डालें");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const phoneNumber = "+91" + form.mobile;
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setError('');
    } catch (err: any) {
      setError("OTP भेजने में विफल: " + (err.message || "Unknown error"));
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((id: any) => (window as any).recaptchaVerifier.reset(id));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        if (!validateEmail(form.email)) throw new Error("सही फॉर्मेट में ईमेल डालें (उदा: user@mail.com)");
        await loginUser(form.email, form.password);
        onAuthSuccess();
      } else {
        if (!validateEmail(form.email)) throw new Error("ईमेल आईडी सही नहीं है");
        if (!form.name) throw new Error("नाम भरना अनिवार्य है");
        
        if (!otpSent) {
          await handleSendOTP();
          setLoading(false);
          return;
        }

        if (form.otp.length < 6) throw new Error("कृपया 6-अंकों का OTP डालें");

        try {
          await confirmationResult.confirm(form.otp);
        } catch (e) {
          throw new Error("गलत OTP कोड! कृपया दोबारा चेक करें");
        }

        await signupUser(form.name, form.email, form.password, form.mobile);
        onAuthSuccess();
      }
    } catch (err: any) {
      let msg = err.message || "त्रुटि! कृपया दोबारा प्रयास करें";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') msg = "ईमेल या पासवर्ड गलत है";
      if (err.code === 'auth/email-already-in-use') msg = "यह ईमेल पहले से रजिस्टर है";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-[3.5rem] p-10 shadow-4xl relative z-10 border border-slate-100">
        <div id="recaptcha-container"></div>
        
        <div className="text-center mb-8">
          <div className="bg-orange-500 w-20 h-20 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-orange-500/40 border-4 border-white">
            <Monitor size={36} />
          </div>
          <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter leading-none">Maurya Portal</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Verified Digital Access</p>
        </div>

        {error && (
          <div className="mb-6 p-5 bg-red-50 text-red-600 text-xs font-black rounded-2xl border border-red-100 flex items-center gap-4 animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  required 
                  placeholder="अपना पूरा नाम" 
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  required 
                  type="tel"
                  maxLength={10}
                  disabled={otpSent}
                  placeholder="मोबाइल नंबर (10 अंक)" 
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all disabled:opacity-50" 
                  value={form.mobile} 
                  onChange={e => setForm({...form, mobile: e.target.value.replace(/\D/g, '')})} 
                />
                {otpSent && <CheckCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500" size={20} />}
              </div>

              {otpSent && (
                <div className="relative animate-in slide-in-from-top-4">
                  <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
                  <input 
                    required 
                    placeholder="6-अंकों का OTP कोड" 
                    maxLength={6}
                    className="w-full pl-16 pr-6 py-5 bg-blue-50 border border-blue-100 rounded-[1.5rem] text-blue-900 text-sm font-black tracking-[0.5em] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                    value={form.otp} 
                    onChange={e => setForm({...form, otp: e.target.value.replace(/\D/g, '')})} 
                  />
                </div>
              )}
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              required 
              placeholder="ईमेल एड्रेस (Asli Email)" 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              required 
              placeholder="पासवर्ड (कम से कम 6)" 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-blue-900 hover:bg-black text-white py-6 rounded-[1.5rem] font-black text-sm uppercase flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-900/30 active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                {!isLogin && !otpSent ? 'OTP भेजें' : (isLogin ? 'सुरक्षित लॉगिन' : 'वेरिफाई और रजिस्टर')}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setOtpSent(false); }}
            className="text-[10px] font-black text-slate-400 hover:text-blue-900 uppercase tracking-[0.2em] transition-colors"
          >
            {isLogin ? 'नया अकाउंट चाहिए? रजिस्टर करें' : 'पहले से अकाउंट है? लॉगिन करें'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
