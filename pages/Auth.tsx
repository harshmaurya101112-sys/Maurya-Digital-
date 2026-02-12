
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, Globe, Loader2, Landmark, CheckCircle } from 'lucide-react';

const AuthPage: React.FC<{onAuthSuccess: () => void}> = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      {/* Official Header like CSC */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500 p-2 rounded-lg text-white">
            <Landmark size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-blue-950 uppercase tracking-tighter">Digital Maurya</h1>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Common Service Centre Gateway</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1200px-Digital_India_logo.svg.png" className="h-10 opacity-70" alt="Digital India" />
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <p className="text-[9px] font-black text-slate-500 uppercase">Helpline: 1800-XXX-XXXX</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3.5rem] shadow-4xl overflow-hidden border border-slate-100">
          
          {/* Left Side: Info */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-16 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block bg-orange-500 text-[9px] font-black uppercase px-4 py-1.5 rounded-full mb-6 tracking-widest">Secure Portal</span>
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">Apna Seva Kendra Hub</h2>
              <p className="text-blue-200 text-sm font-medium leading-relaxed opacity-80">Access over 200+ government and private services through our high-speed merchant bridge. Secure, Fast, and Reliable.</p>
              
              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <CheckCircle className="text-orange-400" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Instant Wallet Load</span>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <CheckCircle className="text-orange-400" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Auto-Fill Form Helper</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 pt-10 border-t border-white/10 mt-10">
              <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.3em]">Managed by Maurya Tech Solutions</p>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Right Side: Login Button */}
          <div className="p-16 flex flex-col justify-center items-center text-center">
            <div className="bg-slate-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-blue-900 mb-8 border border-slate-100 shadow-inner">
              <ShieldCheck size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Merchant Login</h3>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mb-12">Click below to enter Digital Maurya Dashboard</p>

            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-8 rounded-[2rem] font-black text-lg uppercase flex items-center justify-center gap-6 shadow-2xl shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 group disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={28} /> : <Lock size={24} />}
              {loading ? 'Redirection...' : 'Connect to Gateway'}
              {!loading && <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />}
            </button>

            <div className="mt-12 flex items-center gap-4 justify-center">
              <Globe className="text-slate-200" size={24} />
              <div className="text-left">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secure Handshake</p>
                <p className="text-[10px] font-black text-slate-900">AES-256 BIT SSL</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-6 flex justify-center items-center gap-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">© 2025 DIGITAL MAURYA. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4">
          <span className="text-[8px] font-black text-blue-600 uppercase cursor-pointer">Terms</span>
          <span className="text-[8px] font-black text-blue-600 uppercase cursor-pointer">Privacy</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
