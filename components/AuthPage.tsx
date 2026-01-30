
import React, { useState } from 'react';
import { Monitor, User, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { loginUser, signupUser } from '../services/firebase_mock';

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let user;
      if (isLogin) {
        user = await loginUser(email, password);
      } else {
        user = await signupUser(name, email, password);
      }
      onAuthSuccess(user);
    } catch (err: any) {
      console.error(err);
      let message = "कुछ गलत हुआ। कृपया दोबारा प्रयास करें।";
      if (err.message.includes('user-not-found')) message = "ईमेल या पासवर्ड गलत है।";
      if (err.message.includes('email-already-in-use')) message = "यह ईमेल पहले से रजिस्टर है।";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-6 relative overflow-hidden text-slate-900">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-800 rounded-full blur-[150px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-600 rounded-full blur-[150px] opacity-10 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-white/10">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="bg-blue-800 text-white p-4 rounded-[1.5rem] shadow-xl mb-4">
              <Monitor className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight uppercase">Maurya Portal</h1>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mt-2">
              {isLogin ? 'लॉगिन करें' : 'नया अकाउंट बनाएं'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">नाम</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" required placeholder="अपना नाम"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-sm"
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ईमेल</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" required placeholder="email@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-sm"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">पासवर्ड</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-sm"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'प्रतीक्षा करें...' : (isLogin ? 'लॉगिन' : 'रजिस्टर')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-xs font-black text-blue-800 uppercase tracking-widest"
            >
              {isLogin ? 'अकाउंट नहीं है? रजिस्टर करें' : 'अकाउंट है? लॉगिन करें'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
