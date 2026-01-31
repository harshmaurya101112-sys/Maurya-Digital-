import React, { useState, useEffect } from 'react';
import { db, collection, query, onSnapshot, adminUpdateUser, makeUserAdmin, deleteUserDB } from '../firebase';
import { UserProfile } from '../types';
import { Users, ShieldAlert, Search, ArrowRight, UserPlus, Edit, Trash2, X, Mail, Phone, User as UserIcon, MapPin, Wallet, Check, Loader2 } from 'lucide-react';

const AdminPage: React.FC<{currentUser: UserProfile, onNotify: (m: string) => void}> = ({ currentUser, onNotify }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetId, setTargetId] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Real-time user list sync
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => d.data() as UserProfile);
      setUsers(list);
    });
    return () => unsub();
  }, []);

  const handleGrantAdmin = async () => {
    if (!targetId) return;
    setProcessing(true);
    try {
      await makeUserAdmin(targetId);
      onNotify("Admin status granted!");
      setTargetId('');
    } catch (e) {
      onNotify("Error: UID not found");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    setProcessing(true);
    try {
      await deleteUserDB(uid);
      onNotify("User deleted successfully");
      setShowDeleteConfirm(null);
    } catch (e) {
      onNotify("Delete failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setProcessing(true);
    try {
      await adminUpdateUser(editingUser.uid, {
        displayName: editingUser.displayName,
        email: editingUser.email,
        mobile: editingUser.mobile,
        address: editingUser.address,
        walletBalance: Number(editingUser.walletBalance)
      });
      onNotify("User info updated!");
      setEditingUser(null);
    } catch (e) {
      onNotify("Update failed");
    } finally {
      setProcessing(false);
    }
  };

  const filtered = users.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.mobile && u.mobile.includes(searchTerm))
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Analytics Card */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-blue-950 uppercase text-[10px] mb-6 flex items-center gap-2 tracking-widest">
              <ShieldAlert className="text-orange-600" size={16} /> Fast Track Access
            </h3>
            <div className="space-y-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                Manually grant admin privileges via UID string.
              </p>
              <input 
                placeholder="Paste UID here" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black outline-none focus:border-blue-500"
                value={targetId} 
                onChange={e => setTargetId(e.target.value)} 
              />
              <button 
                onClick={handleGrantAdmin} 
                disabled={processing}
                className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl disabled:opacity-50"
              >
                {processing ? <Loader2 className="animate-spin" size={14} /> : <>Promote to Admin <ArrowRight size={14} /></>}
              </button>
            </div>
          </div>

          <div className="bg-blue-900 p-8 rounded-[3rem] text-white shadow-3xl">
            <p className="text-[10px] font-black uppercase mb-1 tracking-widest opacity-80">Total Retailers</p>
            <h2 className="text-5xl font-black">{users.length}</h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase bg-white/20 p-2 rounded-xl">
              <UserPlus size={14} /> Real-time Sync Active
            </div>
          </div>
        </div>

        {/* User Management View */}
        <div className="xl:col-span-3 bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="font-black text-blue-950 uppercase text-xs flex items-center gap-2">
                <Users size={16} className="text-blue-600" /> Database Explorer
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Edit or Remove users instantly</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                placeholder="Search user..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black outline-none focus:border-blue-500"
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-[10px] font-black text-slate-400 uppercase">
                  <th className="px-10 py-6">Member Information</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Balance</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(u => (
                  <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${u.isAdmin ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                          {u.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">{u.displayName}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{u.email}</p>
                          <p className="text-[8px] text-blue-500 font-mono">ID: {u.uid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${u.isAdmin ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {u.isAdmin ? 'ADMIN' : 'RETAILER'}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-slate-900">₹{u.walletBalance.toLocaleString('hi-IN')}</p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingUser(u)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(u.uid)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Editing Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[600] bg-blue-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-4xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setEditingUser(null)} className="absolute top-10 right-10 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-blue-950 uppercase mb-8">Edit User Profile</h2>
            
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><UserIcon size={12}/> Full Name</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
                  value={editingUser.displayName} onChange={e => setEditingUser({...editingUser, displayName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><Mail size={12}/> Email Address</label>
                <input required type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
                  value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><Phone size={12}/> Mobile Number</label>
                <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
                  value={editingUser.mobile || ''} onChange={e => setEditingUser({...editingUser, mobile: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><Wallet size={12}/> Wallet Balance (₹)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
                  value={editingUser.walletBalance} onChange={e => setEditingUser({...editingUser, walletBalance: Number(e.target.value)})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><MapPin size={12}/> Service Address</label>
                <textarea rows={2} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm resize-none outline-none focus:border-blue-500"
                  value={editingUser.address || ''} onChange={e => setEditingUser({...editingUser, address: e.target.value})} />
              </div>
              <div className="md:col-span-2 pt-6">
                <button type="submit" disabled={processing} className="w-full py-5 bg-blue-900 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                  {processing ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} /> Update User Database</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[700] bg-red-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-12 text-center">
            <div className="bg-red-100 text-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <Trash2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">Confirm Deletion</h2>
            <p className="text-slate-500 font-bold mb-10 text-sm">Warning: This cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
              <button onClick={() => handleDeleteUser(showDeleteConfirm)} disabled={processing} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] disabled:opacity-50">
                {processing ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;