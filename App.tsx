
import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChangedListener, db, doc, onSnapshot, logoutUser, updateWalletOnDB } from './firebase';
import { UserProfile } from './types';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ServicesPage from './pages/Services';
import WalletPage from './pages/Wallet';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { CheckCircle, AlertCircle, Loader2, Mail, LogOut, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('maurya_last_page') || 'dashboard');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    localStorage.setItem('maurya_last_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    // The key to fixing the refresh issue is waiting for this listener
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
                displayName: fbUser.displayName || 'User',
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

  const handleWalletUpdate = async (amount: number, service: string, type: 'debit' | 'credit' = 'debit', pin?: string) => {
    if (!user) return;
    try {
      await updateWalletOnDB(user.uid, amount, service, type, pin);
      showToast(`${service} सफल!`);
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentPage('dashboard');
    localStorage.removeItem('maurya_last_page');
  };

  const checkVerification = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setIsEmailVerified(auth.currentUser.emailVerified);
      if (auth.currentUser.emailVerified) showToast("ईमेल वेरिफाई हो गया!");
      else showToast("अभी वेरिफाई नहीं हुआ है", "error");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white font-sans">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl animate-pulse"></div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Maurya Digital</h1>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-75"></div>
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-300"></div>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">Verifying Secure Session</p>
      </div>
    </div>
  );

  if (!user) return <AuthPage onAuthSuccess={() => setCurrentPage('dashboard')} />;

  if (!isEmailVerified && !user.isAdmin) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-4xl text-center border border-slate-100">
          <div className="bg-blue-100 w-20 h-20 rounded-[2rem] flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-xl">
            <Mail size={40} />
          </div>
          <h2 className="text-2xl font-black text-blue-950 uppercase mb-4 tracking-tighter">Verify Email</h2>
          <p className="text-slate-400 font-bold mb-8 text-sm leading-relaxed">
            हमने <span className="text-blue-600 font-black">{user.email}</span> पर लिंक भेजा है।
          </p>
          <div className="space-y-3">
            <button onClick={checkVerification} className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all">
              <RefreshCcw size={16} /> I've Verified - Refresh
            </button>
            <button onClick={handleLogout} className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 transition-all">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans overflow-hidden text-slate-900">
      {toast && (
        <div className={`fixed top-10 right-10 z-[300] px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white border border-white/20 backdrop-blur-md`}>
          {toast.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <div className="flex flex-col">
            <span className="font-black text-sm uppercase tracking-tight">{toast.type === 'success' ? 'SUCCESS' : 'ERROR'}</span>
            <span className="text-[10px] font-bold opacity-90">{toast.msg}</span>
          </div>
        </div>
      )}

      <Sidebar activePage={currentPage} onPageChange={setCurrentPage} isAdmin={user.isAdmin} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-[#f8fafc] no-scrollbar">
        <Header user={user} onPageChange={setCurrentPage} onLogout={handleLogout} />
        <main className="p-4 md:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
          {currentPage === 'dashboard' && <Dashboard user={user} onPageChange={setCurrentPage} />}
          {currentPage === 'services' && <ServicesPage user={user} onAction={handleWalletUpdate} />}
          {currentPage === 'wallet' && <WalletPage user={user} />}
          {currentPage === 'profile' && <ProfilePage user={user} onNotify={showToast} />}
          {currentPage === 'admin' && user.isAdmin && <AdminPage currentUser={user} onNotify={showToast} />}
        </main>
      </div>
    </div>
  );
};

export default App;
