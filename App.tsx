
import React, { useState, useEffect } from 'react';
import { db, doc, onSnapshot, logoutUser, updateWalletOnDB, syncAuth0UserToFirebase } from './firebase';
import { UserProfile } from './types';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ServicesPage from './pages/Services';
import WalletPage from './pages/Wallet';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('maurya_last_page') || 'dashboard');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Sync current page to localStorage
  useEffect(() => {
    localStorage.setItem('maurya_last_page', currentPage);
  }, [currentPage]);

  // Session Hydration from LocalStorage
  useEffect(() => {
    const savedUid = localStorage.getItem('maurya_active_uid');
    let unsub: () => void = () => {};

    if (savedUid) {
      setLoading(true);
      unsub = onSnapshot(doc(db, "users", savedUid), (snap) => {
        if (snap.exists()) {
          setUser(snap.data() as UserProfile);
        } else {
          localStorage.removeItem('maurya_active_uid');
          setUser(null);
        }
        setLoading(false);
      }, (err) => {
        console.error("Session Sync Error:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => unsub();
  }, []);

  const handleAuth0Login = async () => {
    setLoading(true);
    try {
      // Simulation of Auth0 Sync
      const mockAuth0User = {
        email: 'harsh.maurya101112@gmail.com',
        name: 'Harsh Maurya',
        sub: 'auth0_harsh123',
        picture: '' 
      };
      
      const profile = await syncAuth0UserToFirebase(mockAuth0User);
      if (profile) {
        setUser(profile);
        localStorage.setItem('maurya_active_uid', profile.uid);
      }
    } catch (error) {
      console.error("Login sync failed:", error);
      showToast("Authentication Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    setLoading(true);
    await logoutUser();
    setUser(null);
    localStorage.removeItem('maurya_active_uid');
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
          <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={32} />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-widest animate-pulse">Maurya Secure Bridge</h2>
        <p className="text-slate-500 text-[9px] font-black uppercase mt-2 tracking-[0.4em]">Restoring Merchant Session...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuth0Login} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        activePage={currentPage} 
        onPageChange={setCurrentPage} 
        isAdmin={user.isAdmin} 
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header user={user} onPageChange={setCurrentPage} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-10 no-scrollbar bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto">
            {currentPage === 'dashboard' && <Dashboard user={user} onPageChange={setCurrentPage} />}
            {currentPage === 'services' && <ServicesPage user={user} onAction={async (amt, svc, type, pin) => {
              try {
                await updateWalletOnDB(user.uid, amt, svc, type, pin);
                showToast(`Service Bridge Success: ${svc}`);
              } catch (e: any) {
                showToast(e.message, "error");
              }
            }} />}
            {currentPage === 'wallet' && <WalletPage user={user} />}
            {currentPage === 'profile' && <ProfilePage user={user} onNotify={showToast} />}
            {currentPage === 'admin' && user.isAdmin && <AdminPage currentUser={user} onNotify={showToast} />}
          </div>
        </main>
      </div>
      {toast && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 px-12 py-6 rounded-[3rem] shadow-4xl font-black text-[11px] uppercase tracking-widest z-[3000] flex items-center gap-4 animate-in slide-in-from-top-12 ${toast.type === 'success' ? 'bg-blue-950 text-white shadow-blue-500/20' : 'bg-red-600 text-white shadow-red-500/20'}`}>
          <CheckCircle size={20} /> {toast.msg}
        </div>
      )}
    </div>
  );
};

export default App;
