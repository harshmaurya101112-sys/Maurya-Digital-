
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, Globe, Loader2, Landmark, CheckCircle } from 'lucide-react';

const AuthPage: React.FC<{onAuthSuccess: () => void}> = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* CSC Style Top Header */}
      <div className="bg-[#020617] text-white px-6 py-2 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
        <div className="flex gap-6">
          <span>Official Portal: Digital Maurya Seva</span>
          <span className="hidden md:block">ISO 27001 Certified</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Globe size={10} /> English / Hindi</span>
          <span className="hidden md:block">Helpline: 1800-XXX-XXXX</span>
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
        <div className="flex gap-8 items-center">
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1200px-Digital_India_logo.svg.png" className="h-12 opacity-80" alt="Digital India" />
          <div className="hidden lg:block h-10 w-[1px] bg-slate-200"></div>
          <div className="hidden lg:flex flex-col items-end">
             <span className="text-[10px] font-black text-blue-900 uppercase">Government Gateway</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase">V 4.0.5 Security</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[4rem] shadow-4xl overflow-hidden border border-slate-100 relative">
          
          {/* CSC Blue Side */}
          <div className="bg-blue-900 p-16 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block bg-orange-600 text-[10px] font-black uppercase px-5 py-2 rounded-full mb-8 tracking-widest shadow-xl">Secure Merchant Node</span>
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-8">Access Digital Services Instantly</h2>
              <p className="text-blue-100/70 text-sm font-medium leading-relaxed max-w-sm">Connect with 200+ Government and Utility portals through our authorized merchant bridge.</p>
              
              <div className="mt-12 space-y-6">
                {[
                  {icon: <CheckCircle className="text-orange-400" />, text: "Real-time Wallet Settlement"},
                  {icon: <CheckCircle className="text-orange-400" />, text: "One-Click Form Auto-Fill"},
                  {icon: <CheckCircle className="text-orange-400" />, text: "Encrypted Data Handshake"}
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-all">{item.icon}</div>
                    <span className="text-xs font-black uppercase tracking-widest">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Login Action Side */}
          <div className="p-16 flex flex-col justify-center items-center text-center">
            <div className="bg-slate-50 w-28 h-28 rounded-[3rem] flex items-center justify-center text-blue-900 mb-8 border border-slate-100 shadow-inner group transition-all hover:scale-105">
              <ShieldCheck size={56} className="group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2 leading-none">VLE Login</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-12">Authorized Personnel Access Only</p>

            <div className="w-full space-y-4">
              <button 
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-black text-white py-8 rounded-[2.5rem] font-black text-lg uppercase flex items-center justify-center gap-6 shadow-3xl shadow-blue-900/20 transition-all hover:translate-y-[-4px] active:scale-95 group disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={28} /> : <Lock size={24} />}
                {loading ? 'Authorizing...' : 'Connect to Gateway'}
                {!loading && <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />}
              </button>
              
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Forgot Security PIN? Contact Admin</p>
            </div>

            <div className="mt-16 flex flex-col items-center gap-4">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-md">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover grayscale opacity-50" />
                   </div>
                 ))}
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Join 500+ Active Merchants</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">© 2025 DIGITAL MAURYA. ALL RIGHTS RESERVED.</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Powered by MeitY - Authorized Service Provider Bridge v4.0</p>
        </div>
        <div className="flex gap-12">
          <div className="text-center">
            <p className="text-[10px] font-black text-blue-900 uppercase">100% Secure</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase">AES-256 Encryption</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-blue-900 uppercase">ISO Certified</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase">Govt Standards</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
