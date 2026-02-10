
import React, { useState, useEffect } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { auth0Config } from './auth0-config';
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
import { CheckCircle, ShieldCheck, AlertCircle, Settings, Loader2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user: auth0User, isAuthenticated, isLoading: authLoading, loginWithRedirect, logout: auth0Logout, error: auth0Error } = useAuth0();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('maurya_last_page') || 'dashboard');
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const isConfigMissing = !auth0Config.domain || !auth0Config.clientId;

  useEffect(() => {
    localStorage.setItem('maurya_last_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    let unsubscribe: any;
    const performSync = async () => {
      if (isAuthenticated && auth0User) {
        setSyncing(true);
        try {
          const profile = await syncAuth0UserToFirebase(auth0User);
          if (profile) {
            // Real-time listener for wallet balance
            unsubscribe = onSnapshot(doc(db, "users", profile.uid), (doc) => {
              if (doc.exists()) {
                setUser(doc.data() as UserProfile);
              }
            });
            localStorage.setItem('maurya_active_uid', profile.uid);
          }
        } catch (error: any) {
          console.error("Firebase Sync Error:", error);
          setSyncError(error.message || "Firebase Connection Failed");
        } finally {
          setSyncing(false);
        }
      }
    };
    performSync();
    return () => unsubscribe?.();
  }, [isAuthenticated, auth0User]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = async () => {
    localStorage.removeItem('maurya_active_uid');
    localStorage.removeItem('maurya_last_page');
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  if (isConfigMissing) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-10 text-center">
        <Settings className="text-orange-500 mb-6 animate-spin" size={64} />
        <h2 className="text-2xl font-black text-white uppercase mb-4">Auth0 Config Missing</h2>
        <p className="text-slate-400 text-sm max-w-md mb-8">Please add VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in Vercel.</p>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
        <h2 className="text-white font-black uppercase tracking-widest text-xs animate-pulse">Checking Secure Session...</h2>
      </div>
    );
  }

  if (isAuthenticated && (syncing || (!user && !syncError))) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="w-16 h-16 text-blue-500 animate-bounce mb-6" />
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Digital Maurya Bridge</h2>
        <p className="text-slate-500 text-[9px] font-black uppercase mt-2 tracking-[0.4em]">Synchronizing Merchant Identity...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => loginWithRedirect()} />;
  }

  if (user) {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar activePage={currentPage} onPageChange={setCurrentPage} isAdmin={user.isAdmin} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header user={user} onPageChange={setCurrentPage} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto p-10 no-scrollbar bg-[#f8fafc]">
            <div className="max-w-[1600px] mx-auto">
              {currentPage === 'dashboard' && <Dashboard user={user} onPageChange={setCurrentPage} />}
              {currentPage === 'services' && <ServicesPage user={user} onAction={async (amt, svc, type, pin) => {
                try {
                  await updateWalletOnDB(user.uid, amt, svc, type, pin);
                  showToast(`Service Success: ${svc}`);
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
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />} 
            {toast.msg}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const App: React.FC = () => (
  <Auth0Provider {...auth0Config}>
    <MainApp />
  </Auth0Provider>
);

export default App;
