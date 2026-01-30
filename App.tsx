
import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, db, doc, onSnapshot, logoutUser, updateWalletOnDB } from './firebase';
import { UserProfile } from './types';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ServicesPage from './pages/Services';
import WalletPage from './pages/Wallet';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<string>(() => localStorage.getItem('maurya_last_page') || 'dashboard');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    localStorage.setItem('maurya_last_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      // Clean up previous snapshot listener if it exists
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = null;
      }

      if (fbUser) {
        // Set up real-time listener for the authenticated user
        unsubSnapshot = onSnapshot(doc(db, "users", fbUser.uid), (snap) => {
          if (snap.exists()) {
            setUser(snap.data() as UserProfile);
          } else {
            // Fallback if data not found in DB but exists in auth
            setUser(fbUser);
          }
          setLoading(false);
        });
      } else {
        setUser(null);
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
      showToast(`${service} भुगतान सफल!`);
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentPage('dashboard');
    localStorage.removeItem('maurya_last_page');
  };

  if (loading) return (
    <div className="h-screen bg-blue-950 flex flex-col items-center justify-center text-white">
      <div className="relative">
        <Loader2 className="w-16 h-16 animate-spin text-orange-500 mb-6" />
        <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full"></div>
      </div>
      <div className="text-center animate-pulse">
        <p className="font-black tracking-[0.4em] uppercase text-[10px] text-blue-400">Maurya Digital</p>
        <p className="font-black text-xl uppercase mt-2">Checking Credentials...</p>
      </div>
    </div>
  );

  // If no user, show AuthPage. App will automatically switch when auth state changes.
  if (!user) return <AuthPage onAuthSuccess={() => setCurrentPage('dashboard')} />;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden text-slate-900">
      {toast && (
        <div className={`fixed top-10 right-10 z-[300] px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white border border-white/20 backdrop-blur-md`}>
          {toast.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <div className="flex flex-col">
            <span className="font-black text-sm uppercase tracking-tight">{toast.type === 'success' ? 'सफल!' : 'त्रुटि!'}</span>
            <span className="text-[10px] font-bold opacity-90">{toast.msg}</span>
          </div>
        </div>
      )}

      <Sidebar 
        activePage={currentPage} 
        onPageChange={setCurrentPage} 
        isAdmin={user.isAdmin} 
        onLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-[#f8fafc] scroll-smooth">
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
