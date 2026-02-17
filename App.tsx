
import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  doc, 
  onSnapshot, 
  onAuthStateChanged, 
  syncUserToFirestore, 
  updateWalletOnDB, 
  logoutUser 
} from './firebase';
import { UserProfile } from './types';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ServicesPage from './pages/Services';
import WalletPage from './pages/Wallet';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ShieldCheck, Loader2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('maurya_last_page') || 'dashboard');
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    localStorage.setItem('maurya_last_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          const profile = await syncUserToFirestore(fUser);
          if (profile) {
            // Listen for real-time changes to the user document
            const unsubDoc = onSnapshot(doc(db, "users", profile.uid), (doc) => {
              if (doc.exists()) {
                setUser(doc.data() as UserProfile);
              }
              setLoading(false);
            });
            return () => unsubDoc();
          }
        } catch (error) {
          console.error("App Sync Error:", error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await logoutUser();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  if (loading) {
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

  if (!firebaseUser) {
    return <AuthPage onNotify={showToast} />;
  }

  // Waiting for Firestore profile to load after Auth succeeds
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Syncing Merchant Identity...</h2>
      </div>
    );
  }

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

const App: React.FC = () => <MainApp />;

export default App;
