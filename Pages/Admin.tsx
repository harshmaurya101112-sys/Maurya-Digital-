
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldAlert, 
  MoreVertical,
  RefreshCw,
  TrendingUp,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { getAllUsers, updateWalletOnDB } from '../firebase';

interface AdminPageProps {
  user: UserProfile;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [manageAmount, setManageAmount] = useState('');
  const [manageNote, setManageNote] = useState('Admin Adjustment');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsersList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredUsers = usersList.filter(u => 
    u.displayName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPortalBalance = usersList.reduce((acc, u) => acc + u.walletBalance, 0);

  const handleUpdateBalance = async (type: 'credit' | 'debit') => {
    if (!selectedUser) return;
    const amount = parseInt(manageAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsUpdating(true);
    try {
      await updateWalletOnDB(selectedUser.uid, amount, 'Admin Panel', type, manageNote);
      alert(`${type === 'credit' ? 'Added' : 'Subtracted'} ₹${amount} to ${selectedUser.displayName}'s wallet.`);
      setSelectedUser(null);
      setManageAmount('');
      fetchAll();
    } catch (err) {
      alert('Error updating balance.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-orange-600" />
            Admin Dashboard
          </h2>
          <p className="text-gray-500 font-medium">पोर्टल के सभी यूजर्स और उनके बैलेंस को यहाँ से कंट्रोल करें।</p>
        </div>
        <button 
          onClick={fetchAll}
          className="flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">कुल यूजर्स (Total Users)</p>
          <h4 className="text-3xl font-black text-gray-900 mt-1">{usersList.length}</h4>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">कुल पोर्टल बैलेंस (Total Floating)</p>
          <h4 className="text-3xl font-black text-gray-900 mt-1">₹{totalPortalBalance.toLocaleString('hi-IN')}</h4>
        </div>
        <div className="bg-blue-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-900/20">
          <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Admin Status</p>
          <h4 className="text-xl font-black mt-1 uppercase">Active Control</h4>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h3 className="text-xl font-black text-gray-800">यूजर मैनेजमेंट (User Management)</h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="नाम या ईमेल से खोजें..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="pb-4 px-4">यूजर प्रोफाइल</th>
                <th className="pb-4 px-4">ईमेल</th>
                <th className="pb-4 px-4">वॉलेट बैलेंस</th>
                <th className="pb-4 px-4">स्टेटस</th>
                <th className="pb-4 px-4 text-right">एक्शन</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="text-sm group hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-black">
                        {u.displayName[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-gray-800">{u.displayName}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 font-medium text-gray-500">{u.email}</td>
                  <td className="py-5 px-4 font-black text-gray-900">₹{u.walletBalance.toLocaleString('hi-IN')}</td>
                  <td className="py-5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${u.isAdmin ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {u.isAdmin ? 'Admin' : 'VLE User'}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <button 
                      onClick={() => setSelectedUser(u)}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                    >
                      Manage Balance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Balance Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blue-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="font-black text-blue-900 uppercase tracking-widest text-xs">मैनेज वॉलेट (Manage Wallet)</h4>
                <p className="text-xs font-bold text-gray-500 mt-1">{selectedUser.displayName}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white rounded-full">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-blue-50 p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase">Current Balance</p>
                  <p className="text-2xl font-black text-blue-900">₹{selectedUser.walletBalance}</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-200" />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">राशि (Amount)</label>
                  <input 
                    type="number" 
                    value={manageAmount}
                    onChange={(e) => setManageAmount(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 font-bold"
                    placeholder="e.g. 500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">रिमार्क (Remark)</label>
                  <input 
                    type="text" 
                    value={manageNote}
                    onChange={(e) => setManageNote(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button 
                    disabled={isUpdating}
                    onClick={() => handleUpdateBalance('debit')}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl font-black text-[10px] uppercase hover:bg-red-100 transition-all border border-red-100"
                  >
                    <ArrowDownLeft className="w-4 h-4" /> Subtract
                  </button>
                  <button 
                    disabled={isUpdating}
                    onClick={() => handleUpdateBalance('credit')}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase hover:bg-green-700 transition-all shadow-lg shadow-green-500/20"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Add Money
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
