import React, { useState, useEffect } from 'react';
// Import updateWalletOnDB to fix the reference error in the main component
import { auth, onAuthStateChangedListener, db, doc, onSnapshot, logoutUser, resendVerification, updateWalletOnDB } from './firebase';
import { UserProfile } from './types';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ServicesPage from './pages/Services';
import WalletPage from './pages/Wallet';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { CheckCircle, AlertCircle, RefreshCcw, ShieldCheck, Send, Loader2, LogOut, MailCheck } from 'lucide-react';

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

  // Handle Auth State and Persistence
  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    const unsubAuth = onAuthStateChangedListener((fbUser) => {
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = null;
      }
      
      if (fbUser) {
        // Strict verification check
        setIsEmailVerified(fbUser.emailVerified);

        // Sync Firestore data
        unsubSnapshot = onSnapshot(doc(db, "users", fbUser.uid), 
          (snap) => {
            if (snap.exists()) {
              setUser(snap.data() as UserProfile);
            } else {
              // Fallback profile if Firestore is slow
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

  const checkVerificationStatus = async () => {
    if (!auth.currentUser) return;
    setChecking(true);
    try {
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      setIsEmailVerified(updatedUser.emailVerified);
      if (updatedUser.emailVerified) {
        showToast("Email verified successfully!", "success");
      } else {
        showToast("Email not verified yet. Please check your inbox.", "error");
      }
    } catch (err) {
      showToast("Verification check failed.", "error");
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await resendVerification();
      showToast("Verification link sent!");
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      showToast("Failed to resend link.", "error");
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={32} />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-widest animate-pulse">Maurya Portal</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase mt-2 tracking-[0.3em]">Establishing Secure Connection...</p>
      </div>
    );
  }

  // Auth Screen
  if (!user) {
    return <AuthPage onAuthSuccess={() => setLoading(true)} />;
  }

  // Verification Wall - NO ACCESS BEYOND THIS IF NOT VERIFIED
  if (!isEmailVerified) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-700 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-md w-full bg-white rounded-[4rem] p-12 text-center shadow-4xl relative z-10 border border-slate-100">
          <div className="bg-orange-500 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-3xl shadow-orange-500/30">
            <MailCheck size={44} />
          </div>
          <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter mb-4">Verification Required</h2>
          <p className="text-slate-500 font-bold mb-8 text-sm leading-relaxed">
            हमने <span className="text-blue-600 font-black">{user.email}</span> पर एक लिंक भेजा है। कृपया अपनी ईमेल आईडी वेरिफाई करें।
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={checkVerificationStatus}
              disabled={checking}
              className="w-full bg-blue-950 text-white py-6 rounded-[1.8rem] font-black uppercase text-xs shadow-3xl hover:bg-black transition-all flex items-center justify-center gap-3"
            >
              {checking ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
              I Have Verified
            </button>
            
            <button 
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="w-full bg-slate-100 text-slate-600 py-6 rounded-[1.8rem] font-black uppercase text-xs hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              {resendTimer > 0 ? `Resend Link (${resendTimer}s)` : 'Resend Verification Link'}
            </button>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 hover:text-red-500 transition-colors"
            >
              <LogOut size={14} /> Logout & Try Different Email
            </button>
          </div>
        </div>
        {toast && (
          <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl font-black text-[10px] uppercase tracking-widest z-50 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            {toast.msg}
          </div>
        )}
      </div>
    );
  }

  // Main Dashboard Content (Only reachable if user + isEmailVerified)
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      <Sidebar 
        activePage={currentPage} 
        onPageChange={setCurrentPage} 
        isAdmin={user.isAdmin} 
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          user={user} 
          onPageChange={setCurrentPage} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && <Dashboard user={user} onPageChange={setCurrentPage} />}
            {currentPage === 'services' && <ServicesPage user={user} onAction={async (amt, svc, type, pin) => {
              // Call the imported updateWalletOnDB function
              const tx = await updateWalletOnDB(user.uid, amt, svc, type, pin);
              showToast(`Success: ${svc} Processed`);
            }} />}
            {currentPage === 'wallet' && <WalletPage user={user} />}
            {currentPage === 'profile' && <ProfilePage user={user} onNotify={showToast} />}
            {currentPage === 'admin' && user.isAdmin && <AdminPage currentUser={user} onNotify={showToast} />}
          </div>
        </main>
      </div>

      {/* Global Toast */}
      {toast && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 px-10 py-5 rounded-[2rem] shadow-4xl font-black text-[10px] uppercase tracking-widest z-[1000] flex items-center gap-3 animate-in slide-in-from-top-10 ${toast.type === 'success' ? 'bg-blue-950 text-white border border-blue-800' : 'bg-red-600 text-white shadow-red-600/20'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default App;