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

  // Sync state with prop updates
  useEffect(() => {
    setFormData({
      name: user.displayName,
      address: user.address || '',
      mobile: user.mobile || ''
    });
  }, [user]);

  const handleSave = async () => {
    if (!formData.name.trim()) return onNotify("नाम भरना ज़रूरी है", "error");
    
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      
      // Strictly update only non-restricted fields
      const updateData = {
        displayName: formData.name.trim(),
        address: formData.address.trim(),
        mobile: formData.mobile.trim()
      };

      await updateDoc(userRef, updateData);
      setEditing(false);
      onNotify("प्रोफ़ाइल अपडेट सफल!");
    } catch (e: any) {
      console.error("Save Error:", e);
      if (e.code === 'permission-denied') {
        onNotify("Permission Denied: Firebase Rules are blocking the update.", "error");
      } else {
        onNotify("त्रुटि: " + (e.message || "Update failed"), "error");
      }
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
              {saving ? 'Saving...' : (editing ? 'Save Changes' : 'Update Profile')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
                <Mail size={14} /> Registered Email
              </label>
              <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 flex items-center justify-between opacity-70">
                <span className="font-black text-slate-500">{user.email}</span>
                <Lock size={14} className="text-slate-400" />
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
                  type="tel"
                  maxLength={10}
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

      <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem] flex items-center gap-6">
        <div className="bg-blue-900 text-white p-4 rounded-3xl">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h4 className="font-black text-blue-900 uppercase text-xs mb-1">Security Status</h4>
          <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
            Your identity is verified. If you need to change your registered email, please contact the master admin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;