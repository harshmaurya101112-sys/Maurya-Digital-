
import React, { useState, useEffect } from 'react';
import { db, collection, query, onSnapshot, adminUpdateUser, deleteUserDB } from '../firebase';
import { UserProfile } from '../types';
import { Users, ShieldAlert, Search, ArrowRight, Edit, Trash2, X, Mail, Phone, User as UserIcon, MapPin, Wallet, Check, Loader2, AlertTriangle, RefreshCw, Key } from 'lucide-react';

const AdminPage: React.FC<{currentUser: UserProfile, onNotify: (m: string, type?: 'success' | 'error') => void}> = ({ currentUser, onNotify }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For Service Credentials editing
  const [tempSvcId, setTempSvcId] = useState('');
  const [tempSvcPass, setTempSvcPass] = useState('');

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ ...d.data(), uid: d.id } as UserProfile));
      setUsers(list);
      setLoading(false);
    }, (err) => {
      setError("Failed to load users.");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setProcessing(true);
    try {
      const updatedCreds = { ...editingUser.serviceCredentials };
      if (tempSvcId) {
        updatedCreds['up_edistrict'] = { id: tempSvcId, pass: tempSvcPass };
      }

      await adminUpdateUser(editingUser.uid, {
        displayName: editingUser.displayName,
        email: editingUser.email.toLowerCase().trim(),
        mobile: editingUser.mobile || '',
        address: editingUser.address || '',
        walletBalance: Number(editingUser.walletBalance),
        isAdmin: editingUser.isAdmin,
        serviceCredentials: updatedCreds
      });
      onNotify("Merchant Data & Credentials Updated!");
      setEditingUser(null);
      setTempSvcId('');
      setTempSvcPass('');
    } catch (e: any) {
      onNotify("Update Error: " + e.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const filtered = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-1 bg-blue-900 p-8 rounded-[3rem] text-white shadow-3xl">
          <p className="text-[10px] font-black uppercase mb-1 tracking-widest opacity-80">Active Merchants</p>
          <h2 className="text-5xl font-black">{users.length}</h2>
          <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/5 text-[9px] font-bold leading-relaxed">
            Admin Tip: Edit a user to assign their UP e-District or PAN Portal credentials for auto-fill helper.
          </div>
        </div>

        <div className="xl:col-span-3 bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h3 className="font-black text-blue-950 uppercase text-xs">Merchant Directory</h3>
            <input 
              placeholder="Search..." 
              className="pl-4 pr-4 py-3 bg-slate-100 border-none rounded-xl text-[10px] font-black w-64 outline-none"
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black text-slate-400 uppercase">
                <th className="px-10 py-6">User</th>
                <th className="px-10 py-6 text-center">Wallet</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u => (
                <tr key={u.uid}>
                  <td className="px-10 py-6">
                    <div className="font-black text-xs text-slate-900">{u.displayName}</div>
                    <div className="text-[9px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-10 py-6 text-center font-black text-xs">₹{u.walletBalance}</td>
                  <td className="px-10 py-6 text-right">
                    <button onClick={() => {
                      setEditingUser(u);
                      setTempSvcId(u.serviceCredentials?.['up_edistrict']?.id || '');
                      setTempSvcPass(u.serviceCredentials?.['up_edistrict']?.pass || '');
                    }} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-900 hover:text-white transition-all">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-[600] bg-blue-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-4xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setEditingUser(null)} className="absolute top-10 right-10 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-blue-950 uppercase mb-8">Edit Merchant</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Display Name</label>
                  <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none"
                    value={editingUser.displayName} onChange={e => setEditingUser({...editingUser, displayName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Balance (₹)</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none"
                    value={editingUser.walletBalance} onChange={e => setEditingUser({...editingUser, walletBalance: Number(e.target.value)})} />
                </div>
              </div>

              {/* Service Credentials Section */}
              <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 space-y-4">
                <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                  <Key size={14} /> Portal Credentials (SSO Emulation)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-blue-400 uppercase ml-2">UP e-District ID</label>
                    <input className="w-full p-3 bg-white border border-blue-100 rounded-xl text-xs font-bold"
                      value={tempSvcId} onChange={e => setTempSvcId(e.target.value)} placeholder="Username" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-blue-400 uppercase ml-2">UP e-District Pass</label>
                    <input className="w-full p-3 bg-white border border-blue-100 rounded-xl text-xs font-bold"
                      value={tempSvcPass} onChange={e => setTempSvcPass(e.target.value)} placeholder="Password" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={processing} className="w-full py-6 bg-blue-900 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 hover:bg-black transition-all">
                {processing ? <Loader2 className="animate-spin" size={18} /> : "Update Merchant Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
