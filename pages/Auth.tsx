
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, Globe, Loader2, Landmark, CheckCircle, Mail, User, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, auth } from '../firebase';

const AuthPage: React.FC<{onNotify: (m: string, t: 'success' | 'error') => void}> = ({ onNotify }) => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onNotify('Welcome Back!', 'success');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        onNotify('Account Created Successfully!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      let msg = "An error occurred";
      if (err.code === 'auth/user-not-found') msg = "User not found";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password";
      if (err.code === 'auth/email-already-in-use') msg = "Email already registered";
      if (err.code === 'auth/invalid-email') msg = "Invalid email format";
      setError(msg);
      onNotify(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <div className="bg-[#020617] text-white px-6 py-2 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
        <div className="flex gap-6">
          <span>Official Portal: Digital Maurya Seva</span>
          <span className="hidden md:block">ISO 27001 Certified</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Globe size={10} /> English / Hindi</span>
          <span className="hidden md:block">Security Level: High</span>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-600/20">
            <Landmark size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tighter leading-none">MAURYA DIGITAL</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Apna CSC Seva Kendra</p>
          </div>
        </div>
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1200px-Digital_India_logo.svg.png" className="h-10 opacity-80 hidden md:block" alt="Digital India" />
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-4xl overflow-hidden border border-slate-100">
          
          <div className="bg-blue-900 p-12 text-white flex flex-col justify-center relative overflow-hidden">
             <div className="relative z-10">
               <span className="bg-orange-600 text-[9px] font-black uppercase px-4 py-1.5 rounded-full mb-6 inline-block tracking-widest">Authorized Access</span>
               <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">Partner With India's Digital Mission</h2>
               <p className="text-blue-200 text-xs font-medium leading-relaxed max-w-xs opacity-70">Join thousands of VLEs providing 200+ essential services to citizens across the nation.</p>
               
               <div className="mt-10 space-y-4">
                 <div className="flex items-center gap-3">
                   <CheckCircle className="text-orange-400" size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Real-time Wallet Settlement</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <CheckCircle className="text-orange-400" size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest">G2C Service Access</span>
                 </div>
               </div>
             </div>
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="p-12 flex flex-col justify-center">
            <div className="mb-10">
              <h3 className="text-2xl font-black text-blue-950 uppercase tracking-tight">{isLogin ? 'VLE Login' : 'Register Partner'}</h3>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">Official Merchant Gateway</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase animate-shake">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" required placeholder="Enter Legal Name"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={name} onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email" required placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="password" required placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-900 hover:bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50 mt-4 group"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Connect Gateway' : 'Create Account')}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[9px] font-black text-blue-900 uppercase tracking-widest hover:underline"
              >
                {isLogin ? "Don't have an account? Register Now" : "Already a partner? Login here"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-slate-400">
        <p className="text-[9px] font-black uppercase tracking-[0.2em]">© 2025 DIGITAL MAURYA. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
};

export default AuthPage;
