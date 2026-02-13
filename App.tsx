
import React, { useState, useEffect } from 'react';
import { Auth0Provider, useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2.2.4?deps=react@18.2.0,react-dom@18.2.0';
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
  const { 
    user: auth0User, 
    isAuthenticated, 
    isLoading: authLoading, 
    loginWithRedirect, 
    logout: auth0Logout, 
    error: auth0Error 
  } = useAuth0();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('maurya_last_page') || 'dashboard');
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    localStorage.setItem('maurya_last_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    let unsubscribe: any;
    const performSync = async () => {
      // Logic: Wait until Auth0 says it's definitely authenticated
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

  // 1. Config Check
  if (!auth0Config.domain || !auth0Config.clientId) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-12 text-center">
        <Settings className="text-red-500 mb-6 animate-spin" size={64} />
        <h2 className="text-2xl font-black text-slate-900 uppercase mb-4 tracking-tighter">API Keys Missing</h2>
        <p className="text-slate-500 text-sm max-w-sm">Please ensure VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID are set in Vercel environment variables.</p>
      </div>
    );
  }

  // 2. Refresh handling - This is where the white screen happens if not handled
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 border-b-4 border-blue-900 rounded-full animate-spin"></div>
          <ShieldCheck className="absolute text-blue-900" size={32} />
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-lg font-black text-blue-950 uppercase tracking-widest">Maurya Portal</h3>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 animate-pulse">Establishing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (auth0Error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Auth Link Broken</h2>
        <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto">{auth0Error.message}</p>
        <button onClick={() => window.location.reload()} className="mt-8 bg-blue-950 text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl">Retry Connection</button>
      </div>
    );
  }

  // 3. Not Logged In
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => loginWithRedirect()} />;
  }

  // 4. Final Data Syncing
  if (isAuthenticated && (syncing || !user)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Merchant Data Sync</h2>
      </div>
    );
  }

  // 5. Success
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar activePage={currentPage} onPageChange={setCurrentPage} isAdmin={user?.isAdmin || false} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header user={user!} onPageChange={setCurrentPage} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-10 no-scrollbar bg-[#f8fafc]">
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
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 px-10 py-5 rounded-full shadow-4xl font-black text-[10px] uppercase tracking-widest z-[3000] flex items-center gap-3 animate-in slide-in-from-top-12 ${toast.type === 'success' ? 'bg-blue-900 text-white' : 'bg-red-600 text-white'}`}>
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
