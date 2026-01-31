import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, MapPin, Phone, Mail, Save, Edit2, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { db, doc, updateDoc } from '../firebase';

const ProfilePage: React.FC<{user: UserProfile, onNotify: (m: string, type?: 'success' | 'error') => void}> = ({ user, onNotify }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ 
    name: user.displayName, 
    address: user.address || '', 
    mobile: user.mobile || ''
  });

  // Sync local form state if user data changes from Firestore
  useEffect(() => {
    setFormData({
      name: user.displayName,
      address: user.address || '',
      mobile: user.mobile || ''
    });
  }, [user]);

  const handleSave = async () => {
    if (!formData.name) return onNotify("नाम अनिवार्य है", "error");
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      // User can ONLY update name, address, and mobile. Email is locked.
      await updateDoc(userRef, {
        displayName: formData.name,
        address: formData.address,
        mobile: formData.mobile
      });
      setEditing(false);
      onNotify("प्रोफ़ाइल अपडेट हो गई!");
    } catch (e: any) {
      console.error("Update Error:", e);
      onNotify("अपडेट फेल: " + (e.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[4rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="bg-blue-900 h-40 relative">
          <div className="absolute -bottom-16 left-12 w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center p-3">
            <div className="w-full h-full bg-slate-50 rounded-[2rem] flex items-center justify-center font-black text-5xl text-blue-900 uppercase">
              {user.displayName.charAt(0)}
            </div>
          </div>
        </div>

        <div className="p-12 pt-24">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-4xl font-black text-blue-950 uppercase mb-2 tracking-tighter">{user.displayName}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.isAdmin ? 'bg-orange-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                  {user.isAdmin ? 'Master Admin' : 'Authorized Partner'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">UID: {user.uid}</span>
              </div>
            </div>
            <button 
              onClick={() => editing ? handleSave() : setEditing(true)} 
              disabled={saving}
              className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase flex items-center gap-3 transition-all shadow-2xl ${
                editing ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-blue-950 text-white shadow-blue-950/20'
              } active:scale-95 disabled:opacity-50`}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : (editing ? <Save size={18} /> : <Edit2 size={18} />)}
              {saving ? 'Saving...' : (editing ? 'Confirm Changes' : 'Update Profile')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* EMAIL - ALWAYS LOCKED FOR USER */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
                <Mail size={14} /> Email Address (Primary)
              </label>
              <div className="relative group">
                <p className="font-black text-slate-400 bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 flex items-center justify-between">
                  {user.email}
                  {/* Fixed: Removed 'title' prop from Lucide icon to avoid TS error */}
                  <Lock size={14} className="opacity-40" />
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
                <User size={14} /> Full Legal Name
              </label>
              {editing ? (
                <input 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              ) : (
                <p className="font-black text-slate-800 bg-slate-50/50 p-5 rounded-[1.5rem] border border-transparent">{user.displayName}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
                <Phone size={14} /> Mobile Number
              </label>
              {editing ? (
                <input 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" 
                  value={formData.mobile} 
                  onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})} 
                />
              ) : (
                <p className="font-black text-slate-800 bg-slate-50/50 p-5 rounded-[1.5rem] border border-transparent">{user.mobile || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
                <MapPin size={14} /> Store Address
              </label>
              {editing ? (
                <textarea 
                  rows={2} 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all resize-none" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                />
              ) : (
                <p className="font-black text-slate-800 bg-slate-50/50 p-5 rounded-[1.5rem] border border-transparent">{user.address || 'Address details missing'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[3rem] flex items-center gap-6">
        <div className="bg-emerald-600 text-white p-4 rounded-3xl">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h4 className="font-black text-emerald-900 uppercase text-xs mb-1">Identity Policy</h4>
          <p className="text-[11px] text-emerald-700 font-bold leading-relaxed">
            सुरक्षा कारणों से ईमेल बदलने के लिए कृपया एडमिन से संपर्क करें। आप अपना नाम, मोबाइल और पता खुद अपडेट कर सकते हैं।
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;