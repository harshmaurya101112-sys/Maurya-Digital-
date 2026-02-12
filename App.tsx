
import React, { useState, useEffect } from 'react';
// Direct URL imports ensure Vercel builds don't fail due to missing node_modules
import { Auth0Provider, useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2.2.4';
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

// Direct ESM import for Lucide icons to match the version exactly
import { ShieldCheck, Settings, Loader2, AlertCircle } from 'https://esm.sh/lucide-react@0.263.1';

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

  // Config Validation
  const isConfigMissing = !auth0Config.domain || auth0Config.domain.includes('undefined') || !auth0Config.clientId;

  useEffect(() => {
    localStorage.setItem('maurya_last_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    let unsubscribe: any;
    const performSync = async () => {
      // Refresh par isAuthenticated thodi der baad true hota hai, isliye SDK ka wait zaroori hai
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

  // 1. Missing Keys Error (Prevents White Screen)
  if (isConfigMissing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center">
        <div className="bg-white p-12 rounded-[3rem] border border-red-100 shadow-2xl max-w-md">
          <Settings className="text-red-500 mb-6 mx-auto animate-spin" size={64} />
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-4 tracking-tighter">Gateway Config Error</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium italic">
            Bhai, Vercel Dashboard mein Environment Variables (VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID) check karein.
          </p>
          <div className="bg-red-50 p-4 rounded-2xl text-[10px] text-red-600 font-bold uppercase tracking-widest">
            Fix required in Vercel Settings
          </div>
        </div>
      </div>
    );
  }

  // 2. SDK Loading (Refresh ke waqt ye dikhna chahiye)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <ShieldCheck className="absolute inset-0 m-auto text-blue-600" size={32} />
        </div>
        <p className="mt-8 text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Connecting to CSC Gateway...</p>
      </div>
    );
  }

  // 3. Connection Error
  if (auth0Error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-xl font-black text-slate-900 uppercase">Handshake Failed</h2>
        <p className="text-slate-500 text-xs mt-2">{auth0Error.message}</p>
        <button onClick={() => window.location.reload()} className="mt-8 bg-blue-900 text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-900/20">Retry Secure Link</button>
      </div>
    );
  }

  // 4. If Not Logged In
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => loginWithRedirect()} />;
  }

  // 5. If Logged in but Syncing Data
  if (isAuthenticated && (syncing || !user)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Merchant Data Sync</h2>
        <p className="text-slate-400 text-[9px] font-black uppercase mt-2 tracking-[0.4em]">Fetching your wallet and services...</p>
      </div>
    );
  }

  // 6. Main Portal UI
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
