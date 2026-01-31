import React, { useState, useEffect } from 'react';
import { db, collection, query, onSnapshot, adminUpdateUser, makeUserAdmin, deleteUserDB } from '../firebase';
import { UserProfile } from '../types';
import { Users, ShieldAlert, Search, ArrowRight, UserPlus, Edit, Trash2, X, Mail, Phone, User as UserIcon, MapPin, Wallet, Check, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

const AdminPage: React.FC<{currentUser: UserProfile, onNotify: (m: string, type?: 'success' | 'error') => void}> = ({ currentUser, onNotify }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetId, setTargetId] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all users
  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = query(collection(db, "users"));
    
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => {
        const data = d.data();
        return { ...data, uid: d.id } as UserProfile;
      });
      setUsers(list);
      setLoading(false);
    }, (err) => {
      console.error("Firestore Admin Error:", err);
      setError("User list load nahi ho payi. Firebase Rules check karein.");
      setLoading(false);
    });
    
    return () => unsub();
  }, []);

  const handleGrantAdmin = async () => {
    if (!targetId.trim()) return;
    setProcessing(true);
    try {
      await makeUserAdmin(targetId.trim());
      onNotify("User Promoted to Admin!");
      setTargetId('');
    } catch (e: any) {
      onNotify("Error: " + (e.message || "UID not found"), "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (uid === currentUser.uid) return onNotify("Aap khud ko delete nahi kar sakte", "error");
    setProcessing(true);
    try {
      await deleteUserDB(uid);
      onNotify("User account removed");
      setShowDeleteConfirm(null);
    } catch (e: any) {
      onNotify("Delete failure: " + e.message, "error");
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
        email: editingUser.email.toLowerCase().trim(),
        mobile: editingUser.mobile || '',
        address: editingUser.address || '',
        walletBalance: Number(editingUser.walletBalance),
        isAdmin: editingUser.isAdmin
      });
      onNotify("User data updated successfully!");
      setEditingUser(null);
    } catch (e: any) {
      onNotify("Update Error: " + e.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const filtered = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.mobile && u.mobile.includes(searchTerm)) ||
    u.uid === searchTerm
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Admin Tools */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-blue-950 uppercase text-[10px] mb-6 flex items-center gap-2 tracking-widest">
              <ShieldAlert className="text-orange-600" size={16} /> Admin Authority
            </h3>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase ml-2">Elevate by UID</p>
              <input 
                placeholder="Paste UID here" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black outline-none focus:border-blue-500 shadow-inner"
                value={targetId} 
                onChange={e => setTargetId(e.target.value)} 
              />
              <button 
                onClick={handleGrantAdmin} 
                disabled={processing || !targetId}
                className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl disabled:opacity-50"
              >
                {processing ? <Loader2 className="animate-spin" size={14} /> : <>Grant Master Access <ArrowRight size={14} /></>}
              </button>
            </div>
          </div>

          <div className="bg-blue-900 p-8 rounded-[3rem] text-white shadow-3xl relative overflow-hidden">
            <p className="text-[10px] font-black uppercase mb-1 tracking-widest opacity-80">Database Stats</p>
            <h2 className="text-5xl font-black">{users.length}</h2>
            <p className="text-[10px] font-bold text-blue-300 mt-2 uppercase">Registered Merchants</p>
          </div>
        </div>

        {/* User Directory */}
        <div className="xl:col-span-3 bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/20">
            <div>
              <h3 className="font-black text-blue-950 uppercase text-xs flex items-center gap-2">
                <Users size={16} className="text-blue-600" /> Merchant Directory
              </h3>
              {error && (
                <p className="text-[10px] font-black text-red-500 uppercase mt-2 flex items-center gap-2">
                  <AlertTriangle size={12} /> {error}
                </p>
              )}
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                placeholder="Search name, mobile or email..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black outline-none focus:border-blue-500"
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-40 text-center flex flex-col items-center gap-4">
                <RefreshCw size={40} className="animate-spin text-blue-900 opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Database...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr className="text-[10px] font-black text-slate-400 uppercase">
                    <th className="px-10 py-6">Identity</th>
                    <th className="px-10 py-6 text-center">Status</th>
                    <th className="px-10 py-6 text-center">Wallet</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length > 0 ? filtered.map(u => (
                    <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${u.isAdmin ? 'bg-orange-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            {u.displayName?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900">{u.displayName}</p>
                            <p className="text-[9px] text-slate-400 font-bold">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black tracking-widest ${u.isAdmin ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-slate-100 text-slate-400'}`}>
                          {u.isAdmin ? 'MASTER' : 'PARTNER'}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <p className="text-xs font-black text-slate-900 tabular-nums">₹{u.walletBalance.toLocaleString('hi-IN')}</p>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingUser(u)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-900 hover:text-white transition-all shadow-sm">
                            <Edit size={16} />
                          </button>
                          {u.uid !== currentUser.uid && (
                            <button onClick={() => setShowDeleteConfirm(u.uid)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No matching users found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Editing Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[600] bg-blue-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-4xl relative overflow-hidden">
            <button onClick={() => setEditingUser(null)} className="absolute top-10 right-10 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-blue-950 uppercase mb-8">Admin Control</h2>
            
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><UserIcon size={12}/> Legal Name</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 shadow-inner"
                  value={editingUser.displayName} onChange={e => setEditingUser({...editingUser, displayName: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2 font-black"><Mail size={12}/> Email (Sensitive)</label>
                <input required type="email" className="w-full p-4 bg-orange-50 border border-orange-100 rounded-2xl font-black text-sm outline-none focus:border-orange-500 shadow-inner"
                  value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Phone size={12}/> Mobile</label>
                <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 shadow-inner"
                  value={editingUser.mobile || ''} onChange={e => setEditingUser({...editingUser, mobile: e.target.value.replace(/\D/g, '')})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Wallet size={12}/> Balance (₹)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:border-blue-500 shadow-inner"
                  value={editingUser.walletBalance} onChange={e => setEditingUser({...editingUser, walletBalance: Number(e.target.value)})} />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><MapPin size={12}/> Address</label>
                <textarea rows={2} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm resize-none outline-none focus:border-blue-500 shadow-inner"
                  value={editingUser.address || ''} onChange={e => setEditingUser({...editingUser, address: e.target.value})} />
              </div>

              <div className="md:col-span-2 pt-6">
                <button type="submit" disabled={processing} className="w-full py-6 bg-blue-900 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 hover:bg-black transition-all">
                  {processing ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} /> Push Update</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[700] bg-red-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-12 text-center animate-in zoom-in-95">
            <div className="bg-red-100 text-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={36} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">Confirm Deletion</h2>
            <p className="text-slate-400 font-bold mb-10 text-xs uppercase tracking-widest">This account will be erased from database.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px]">Abort</button>
              <button onClick={() => handleDeleteUser(showDeleteConfirm)} disabled={processing} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-red-500/20">
                {processing ? "Erasing..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;