
import React, { useState, useEffect } from 'react';
import { getAllUsers, adminUpdateUser, makeUserAdmin } from '../firebase';
import { UserProfile } from '../types';
import { Users, ShieldAlert, Search, ArrowRight, UserPlus, CreditCard, Edit, Check } from 'lucide-react';

const AdminPage: React.FC<{currentUser: UserProfile, onNotify: (m: string) => void}> = ({ currentUser, onNotify }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetId, setTargetId] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const refreshUsers = async () => {
    const list = await getAllUsers();
    setUsers(list);
  };

  useEffect(() => { refreshUsers(); }, []);

  const handleGrantAdmin = async () => {
    if (!targetId) return;
    try {
      await makeUserAdmin(targetId);
      onNotify("एडमिन अधिकार प्रदान किए गए!");
      setTargetId('');
      refreshUsers();
    } catch (e) {
      onNotify("त्रुटi: आईडी सही नहीं है");
    }
  };

  const handleUpdateBalance = async (uid: string, newBalance: number) => {
    try {
      await adminUpdateUser(uid, { walletBalance: newBalance });
      onNotify("बैलेंस अपडेट सफल!");
      refreshUsers();
      setEditingUser(null);
    } catch (e) {
      onNotify("बैलेंस अपडेट फेल");
    }
  };

  const filtered = users.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mobile?.includes(searchTerm)
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Quick Admin Actions */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-blue-950 uppercase text-[10px] mb-6 flex items-center gap-2 tracking-widest">
              <ShieldAlert className="text-orange-600" size={16} /> Fast Track Admin
            </h3>
            <div className="space-y-5">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                Paste User UID here to grant full control instantly.
              </p>
              <input placeholder="Enter User UID" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black outline-none focus:border-blue-500"
                value={targetId} onChange={e => setTargetId(e.target.value)} />
              <button onClick={handleGrantAdmin} className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-blue-900/10">
                Grant Admin Access <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-orange-600 p-8 rounded-[3rem] text-white shadow-3xl shadow-orange-600/20">
            <p className="text-[10px] font-black uppercase mb-1 tracking-widest opacity-80">Total Users</p>
            <h2 className="text-5xl font-black">{users.length}</h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase bg-white/20 p-2 rounded-xl border border-white/10">
              <UserPlus size={14} /> Master DB Linked
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="xl:col-span-3 bg-white rounded-[3rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="font-black text-blue-950 uppercase text-xs flex items-center gap-2">
                <Users size={16} className="text-blue-600" /> Member Database
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Manage retailers and admins</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input placeholder="Search name/email/mobile..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black outline-none focus:border-blue-500"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                  <th className="px-10 py-6">Member Info</th>
                  <th className="px-10 py-6">Role</th>
                  <th className="px-10 py-6">Wallet Balance</th>
                  <th className="px-10 py-6">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(u => (
                  <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs uppercase shadow-inner ${u.isAdmin ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                          {u.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">{u.displayName}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{u.email} • {u.mobile}</p>
                          <p className="text-[8px] text-blue-500 font-mono mt-0.5">UID: {u.uid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${u.isAdmin ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {u.isAdmin ? 'MASTER ADMIN' : 'RETAILER'}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      {editingUser?.uid === u.uid ? (
                        <div className="flex items-center gap-2">
                          <input type="number" className="w-24 p-2 bg-slate-100 rounded-lg text-xs font-black" 
                            defaultValue={u.walletBalance} id={`bal-${u.uid}`} />
                          <button onClick={() => {
                            const val = (document.getElementById(`bal-${u.uid}`) as HTMLInputElement).value;
                            handleUpdateBalance(u.uid, Number(val));
                          }} className="p-2 bg-green-500 text-white rounded-lg"><Check size={14} /></button>
                        </div>
                      ) : (
                        <p className="text-sm font-black text-slate-900">₹{u.walletBalance.toLocaleString('hi-IN')}</p>
                      )}
                    </td>
                    <td className="px-10 py-6">
                      <button onClick={() => setEditingUser(editingUser?.uid === u.uid ? null : u)} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1.5 hover:text-blue-800">
                        <Edit size={12} /> Edit User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
