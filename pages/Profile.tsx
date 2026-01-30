
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, MapPin, Phone, Mail, Save, Edit2 } from 'lucide-react';
import { doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../firebase';

const ProfilePage: React.FC<{user: UserProfile, onNotify: (m: string) => void}> = ({ user, onNotify }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.displayName, address: user.address || '', mobile: user.mobile || '' });

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: formData.name,
        address: formData.address,
        mobile: formData.mobile
      });
      setEditing(false);
      onNotify("प्रोफ़ाइल अपडेट सफल!");
    } catch (e) {
      onNotify("अपडेट विफल हुआ");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-blue-900 h-32 relative">
        <div className="absolute -bottom-12 left-10 w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center p-2">
          <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center font-black text-3xl text-blue-900 uppercase">
            {user.displayName.charAt(0)}
          </div>
        </div>
        <button onClick={() => editing ? handleSave() : setEditing(true)} className="absolute bottom-4 right-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all">
          {editing ? <Save size={16} /> : <Edit2 size={16} />}
          {editing ? 'Save Profile' : 'Edit Profile'}
        </button>
      </div>

      <div className="p-10 pt-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> Full Name
            </label>
            {editing ? (
              <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-blue-500" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            ) : (
              <p className="font-black text-slate-900">{user.displayName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Phone size={12} /> Mobile Number
            </label>
            {editing ? (
              <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-blue-500" 
                value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            ) : (
              <p className="font-black text-slate-900">{user.mobile || 'Not Set'}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Mail size={12} /> Email Address
            </label>
            <p className="font-black text-slate-900">{user.email}</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={12} /> Physical Address
            </label>
            {editing ? (
              <textarea rows={3} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-blue-500 resize-none" 
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            ) : (
              <p className="font-black text-slate-900 leading-relaxed">{user.address || 'नो एड्रेस सेव्ड - कृपया एडिट बटन का उपयोग करके अपना पता जोड़ें।'}</p>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50">
          <div className="bg-blue-50 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Account Type</p>
              <p className="font-black text-blue-900">{user.isAdmin ? 'MASTER ADMIN' : 'RETAILER PARTNER'}</p>
            </div>
            <div className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase">Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
