
import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChangedListener, db, doc, onSnapshot, logoutUser, updateWalletOnDB, resendVerification } from './firebase';
import { UserProfile } from './types';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ServicesPage from './pages/Services';
import WalletPage from './pages/Wallet';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { CheckCircle, AlertCircle, Mail, LogOut, RefreshCcw, ShieldCheck, Send, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('maurya_last_page') || 'dashboard');
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    localStorage.setItem('maurya_last_page', currentPage);
  }, [currentPage]);

  // Timer for resend email
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    const unsubAuth = onAuthStateChangedListener((fbUser) => {
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = null;
      }
      
      if (fbUser) {
        setIsEmailVerified(fbUser.emailVerified);
        unsubSnapshot = onSnapshot(doc(db, "users", fbUser.uid), 
          (snap) => {
            if (snap.exists()) {
              setUser(snap.data() as UserProfile);
            } else {
              setUser({
                uid: fbUser.uid,
                email: fbUser.email || '',
                displayName: fbUser.displayName || 'Retailer',
                walletBalance: 0,
                isAdmin: fbUser.email === 'harsh.maurya101112@gmail.com',
                createdAt: new Date().toISOString()
              });
            }
            setLoading(false);
          },
          (error) => {
            console.error("Firestore sync error:", error);
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setIsEmailVerified(false);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    setLoading(true);
    await logoutUser();
    setCurrentPage('dashboard');
    localStorage.removeItem('maurya_last_page');
    setLoading(false);
  };

  const checkVerification = async () => {
    if (!auth.currentUser) return;
    setChecking(true);
    try {
      // Force reload to get latest status from Firebase servers
      await auth.currentUser.reload();
      const verified = auth.currentUser.emailVerified;
      setIsEmailVerified(verified);
      
      if (verified) {
        showToast("अकाउंट वेरिफाई हो गया! स्वागत है।");
      } else {
        showToast("अभी वेरिफिकेशन नहीं हुआ है। कृपया ईमेल लिंक पर क्लिक करें।", "error");
      }
    } catch (e: any) {
      showToast("Error checking status: " + e.message, "error");
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await resendVerification();
      showToast("वेरिफिकेशन लिंक दोबारा भेज दिया गया है।");
      setResendTimer(60); // 1 minute cooldown
    } catch (e: any) {
      showToast("Resend failed: " + e.message, "error");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white overflow-hidden">
      <div className="relative">
        <div className="w-48 h-48 border-4 border-blue-500/10 rounded-full"></div>
        <div className="absolute inset-0 w-48 h-48 border-t-4 border-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck size={56} className="text-blue-500 animate-pulse" />
        </div>
      </div>
      <p className="mt-10 text-[10px] font-black uppercase tracking-[0.6em] text-slate-500">Securely Loading Portal...</p>
    </div>
  );

  if (!user) return <AuthPage onAuthSuccess={() => setCurrentPage('dashboard')} />;

  // VERIFICATION SCREEN
  if (!isEmailVerified && !user.isAdmin) {
    return (
      <div className="h-screen bg-[#f8fafc] flex items-center justify-center p-6 text-slate-900">
        <div className="max-w-md w-full bg-white rounded-[4.5rem] p-16 shadow-4xl text-center border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
          
          <div className="bg-blue-50 w-28 h-28 rounded-[3.5rem] flex items-center justify-center text-blue-600 mx-auto mb-10 shadow-2xl relative">
            <Send size={56} className={checking ? 'animate-bounce' : ''} />
            {checking && <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
          </div>

          <h2 className="text-4xl font-black text-blue-950 uppercase mb-6 tracking-tighter">Action Required</h2>
          <p className="text-slate-400 font-bold mb-10 text-sm leading-relaxed">
            हमने एक वेरिफिकेशन लिंक <span className="text-blue-600">{user.email}</span> पर भेजा है। 
            <br/><br/>
            <span className="text-slate-800 italic">"I Have Verified It" दबाने से पहले ईमेल में जाकर नीले लिंक पर क्लिक करना ज़रुरी है।</span>
          </p>

          <div className="space-y-4">
            <button 
              onClick={checkVerification} 
              disabled={checking}
              className="w-full bg-blue-950 text-white py-6 rounded-[2rem] font-black uppercase text-xs flex items-center justify-center gap-4 shadow-3xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {checking ? <Loader2 className="animate-spin" /> : <RefreshCcw size={20} />} 
              I Have Verified It
            </button>
            
            <button 
              onClick={handleResend}
              disabled={resendTimer > 0}
              className={`w-full py-4 text-[10px] font-black uppercase tracking-widest transition-all ${resendTimer > 0 ? 'text-slate-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              {resendTimer > 0 ? `Resend Link in ${resendTimer}s` : "Resend Verification Email"}
            </button>

            <button 
              onClick={handleLogout} 
              className="w-full text-slate-400 py-4 font-black uppercase text-[10px] hover:text-red-500 transition-all border-t border-slate-50 mt-4"
            >
              Use Different Account / Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN PORTAL
  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans overflow-hidden text-slate-900">
      {toast && (
        <div className={`fixed top-10 right-10 z-[300] px-10 py-6 rounded-[2.5rem] shadow-4xl flex items-center gap-5 animate-in slide-in-from-right-10 duration-500 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white border border-white/20 backdrop-blur-md`}>
          {toast.type === 'success' ? <CheckCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          <div className="flex flex-col text-left">
            <span className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">{toast.type === 'success' ? 'SUCCESS' : 'ALERT'}</span>
            <span className="text-sm font-bold opacity-95">{toast.msg}</span>
          </div>
        </div>
      )}

      <Sidebar activePage={currentPage} onPageChange={setCurrentPage} isAdmin={user.isAdmin} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-[#f8fafc] no-scrollbar">
        <Header user={user} onPageChange={setCurrentPage} onLogout={handleLogout} />
        <main className="p-4 md:p-12 max-w-[1800px] mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {currentPage === 'dashboard' && <Dashboard user={user} onPageChange={setCurrentPage} />}
          {currentPage === 'services' && <ServicesPage user={user} onAction={async (amt, serv, type, pin) => {
             try {
               await updateWalletOnDB(user.uid, amt, serv, type, pin);
               showToast(`${serv} सफल!`);
             } catch(e:any) { showToast(e.message, 'error'); throw e; }
          }} />}
          {currentPage === 'wallet' && <WalletPage user={user} />}
          {currentPage === 'profile' && <ProfilePage user={user} onNotify={showToast} />}
          {currentPage === 'admin' && user.isAdmin && <AdminPage currentUser={user} onNotify={showToast} />}
        </main>
      </div>
    </div>
  );
};

export default App;
