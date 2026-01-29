
import React, { useState, useEffect } from 'react';
import { auth, db, logoutUser, updateWalletOnDB } from './firebase';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { UserProfile } from './types';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ServicesPage from './pages/Services';
import WalletPage from './pages/Wallet';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Bell, Heart, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'services' | 'wallet' | 'profile' | 'admin'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const unsubscribeDoc = onSnapshot(doc(db, "users", firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as UserProfile);
          }
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentPage('dashboard');
  };

  const updateWallet = async (amount: number, serviceName: string, type: 'debit' | 'credit' = 'debit') => {
    if (!user) return false;
    if (type === 'debit' && user.walletBalance < amount) return false;

    try {
      await updateWalletOnDB(user.uid, amount, serviceName, type);
      notify(`${serviceName} सफल!`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-blue-950 text-white flex-col gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-sm uppercase tracking-widest">Maurya Portal Connecting...</p>
      </div>
    );
  }

  if (!user) return <AuthPage onAuthSuccess={() => {}} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {notification && (
        <div className="fixed top-20 right-8 z-[100] bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold text-sm">{notification}</span>
        </div>
      )}

      <div className="bg-blue-950 text-white py-2 px-4 overflow-hidden border-b border-blue-900 sticky top-0 z-[60]">
        <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[10px] font-black bg-orange-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0">
            <Bell className="w-3 h-3" /> ताज़ा अपडेट
          </span>
          <p className="text-sm font-medium tracking-wide">
            स्वागत है {user.displayName}! • आपका बैलेंस: ₹{user.walletBalance} • Admin Panel अब लाइव है।
          </p>
        </div>
      </div>

      <div className="flex flex-1 relative">
        <Sidebar activePage={currentPage as any} onPageChange={setCurrentPage as any} onLogout={handleLogout} isAdmin={!!user.isAdmin} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header user={user} />
          <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
            {currentPage === 'dashboard' && <Dashboard user={user} onPageChange={setCurrentPage as any} onServiceAction={updateWallet} />}
            {currentPage === 'services' && <ServicesPage user={user} onServiceAction={updateWallet} />}
            {currentPage === 'wallet' && <WalletPage user={user} onAddMoney={(amount) => updateWallet(amount, 'Wallet Topup', 'credit')} />}
            {currentPage === 'profile' && <ProfilePage user={user} />}
            {currentPage === 'admin' && user.isAdmin && <AdminPage user={user} />}
          </main>
          <footer className="bg-slate-950 text-slate-400 py-10 px-8 text-center md:text-left mt-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h4 className="text-white font-black text-lg uppercase">MAURYA PORTAL</h4>
                <p className="text-xs opacity-70">मौर्य जन सेवा केंद्र • Admin Dashboard v1.0</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-orange-500 font-black uppercase">
                <span>Made with</span><Heart className="w-3 h-3 fill-current" /><span>for Digital India</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
