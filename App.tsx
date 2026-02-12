
import React, { useState, useEffect } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { auth0Config } from './auth0-config';
import { db, doc, onSnapshot, updateWalletOnDB, syncAuth0UserToFirebase } from './firebase';
import { UserProfile } from './types';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ServicesPage from './pages/Services';
import WalletPage from './pages/Wallet';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ShieldCheck, Settings, Loader2, AlertCircle } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user: auth0User, isAuthenticated, isLoading: authLoading, loginWithRedirect, logout: auth0Logout, error: auth0Error } = useAuth0();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('maurya_last_page') || 'dashboard');
  const [syncing, setSyncing] = useState(false);
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
            unsubscribe = onSnapshot(doc(db, "users", profile.uid), (doc) => {
              if (doc.exists()) {
                setUser(doc.data() as UserProfile);
              }
            });
          }
        } catch (error) {
          console.error("Firebase Sync Error:", error);
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

  const handleLogout = () => {
    localStorage.clear();
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  if (isConfigMissing) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-10 text-center">
        <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100 shadow-xl max-w-md">
          <Settings className="text-red-500 mb-6 mx-auto animate-spin" size={64} />
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">Auth0 Config Error</h2>
          <p className="text-slate-500 text-sm mb-8">Bhai, Vercel Dashboard mein VITE_AUTH0_DOMAIN aur VITE_AUTH0_CLIENT_ID check karein.</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Authenticating with CSC Gateway...</p>
      </div>
    );
  }

  if (auth0Error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-xl font-black text-slate-900 uppercase">Login Error</h2>
        <p className="text-slate-500 text-xs mt-2">{auth0Error.message}</p>
        <button onClick={() => window.location.reload()} className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-full font-bold uppercase text-xs">Try Again</button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => loginWithRedirect()} />;
  }

  if (isAuthenticated && (syncing || !user)) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="w-16 h-16 text-blue-600 animate-bounce mb-6" />
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Maurya Digital</h2>
        <p className="text-slate-400 text-[9px] font-black uppercase mt-2 tracking-[0.4em]">Setting up your secure workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar activePage={currentPage} onPageChange={setCurrentPage} isAdmin={user?.isAdmin || false} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header user={user!} onPageChange={setCurrentPage} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-10 no-scrollbar bg-[#f1f5f9]">
          <div className="max-w-[1600px] mx-auto">
            {currentPage === 'dashboard' && <Dashboard user={user!} onPageChange={setCurrentPage} />}
            {currentPage === 'services' && <ServicesPage user={user!} onAction={async (amt, svc, type, pin) => {
              try {
                await updateWalletOnDB(user!.uid, amt, svc, type, pin);
                showToast(`Success: ${svc}`);
              } catch (e: any) {
                showToast(e.message, "error");
              }
            }} />}
            {currentPage === 'wallet' && <WalletPage user={user!} />}
            {currentPage === 'profile' && <ProfilePage user={user!} onNotify={showToast} />}
            {currentPage === 'admin' && user?.isAdmin && <AdminPage currentUser={user!} onNotify={showToast} />}
          </div>
        </main>
      </div>
      {toast && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 px-10 py-5 rounded-full shadow-2xl font-black text-[10px] uppercase tracking-widest z-[3000] flex items-center gap-3 animate-in slide-in-from-top-12 ${toast.type === 'success' ? 'bg-blue-900 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <Auth0Provider {...auth0Config}>
    <MainApp />
  </Auth0Provider>
);

export default App;
