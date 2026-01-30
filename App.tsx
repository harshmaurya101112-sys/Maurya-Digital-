
import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Persistence logic: Refresh hone par check karein
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('maurya_session');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Session recovery failed", err);
      localStorage.removeItem('maurya_session');
    } finally {
      // Thoda sa delay taaki experience smooth lage
      setTimeout(() => setLoading(false), 500);
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    // Session ko save karein taaki refresh par kaam kare
    localStorage.setItem('maurya_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('maurya_session');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">Maurya Portal Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
