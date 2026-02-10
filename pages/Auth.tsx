
import React, { useState } from 'react';
import { Monitor, ShieldCheck, ArrowRight, Lock, Globe, Server, Loader2 } from 'lucide-react';

const AuthPage: React.FC<{onAuthSuccess: () => void}> = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    onAuthSuccess();
    // Redirect might take a second, so we keep loading true
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden text-slate-900">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600 rounded-full blur-[250px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-orange-700 rounded-full blur-[250px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-xl w-full relative z-10 text-center">
        <div className="mb-12">
          <div className="bg-orange-500 w-28 h-28 rounded-[3rem] flex items-center justify-center text-white mx-auto mb-8 shadow-4xl shadow-orange-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Monitor size={56} />
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">digitalmaurya.in</h1>
          <p className="text-blue-300 font-bold uppercase tracking-[0.5em] text-xs">Official Service Merchant Portal</p>
        </div>

        <div className="bg-white/80 backdrop-blur-3xl rounded-[4.5rem] p-16 shadow-4xl border border-white/20">
          <h2 className="text-3xl font-black text-blue-950 uppercase mb-4">Secure SSO Login</h2>
          <p className="text-slate-500 font-bold mb-12 text-sm uppercase tracking-widest">Powered by Auth0 Architecture</p>

          <div className="space-y-6">
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-950 hover:bg-black text-white py-8 rounded-[2.5rem] font-black text-lg uppercase flex items-center justify-center gap-6 shadow-4xl transition-all hover:scale-105 active:scale-95 group disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Lock size={24} className="group-hover:text-orange-400 transition-colors" />}
              {loading ? 'Redirecting to Auth0...' : 'Sign In with Auth0'}
              {!loading && <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />}
            </button>
            
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed px-10">
              By clicking sign in, you agree to our Enterprise Security protocols and merchant guidelines.
            </p>
          </div>

          <div className="mt-16 pt-10 border-t border-slate-100 flex items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <Globe className="text-blue-900/20" size={32} />
              <span className="text-[8px] font-black text-slate-300 uppercase">Global Node</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="text-blue-900/20" size={32} />
              <span className="text-[8px] font-black text-slate-300 uppercase">256-bit SSL</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Server className="text-blue-900/20" size={32} />
              <span className="text-[8px] font-black text-slate-300 uppercase">Uptime 99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
