
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Camera, Edit2, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { updateUserBio } from '../firebase';

interface ProfilePageProps {
  user: UserProfile;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserBio(user.uid, { phone, address });
      setIsEditing(false);
      alert('प्रोफाइल अपडेट हो गई है!');
    } catch (err) {
      alert('अपडेट करने में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-900 to-indigo-800 rounded-[2.5rem] shadow-2xl"></div>
        <div className="absolute -bottom-16 left-12 flex items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-[2rem] p-2 shadow-xl ring-4 ring-white">
              <div className="w-full h-full bg-blue-100 rounded-[1.5rem] flex items-center justify-center text-blue-800">
                <User className="w-16 h-16" />
              </div>
            </div>
            <button className="absolute bottom-1 right-1 bg-white p-2 rounded-xl shadow-lg border border-gray-100 hover:bg-slate-50 text-blue-600 transition-all">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="pb-4">
            <h2 className="text-3xl font-black text-white drop-shadow-md">{user.displayName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Verified VLE
              </span>
              <span className="text-blue-100/60 text-xs font-bold tracking-widest uppercase">ID: {user.uid.slice(0, 10).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">खाता विवरण (Account Info)</h3>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={loading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase transition-all ${
                  isEditing ? 'bg-green-600 text-white shadow-green-500/20 shadow-lg' : 'bg-slate-100 text-blue-900 hover:bg-blue-50'
                }`}
              >
                {loading ? 'Sacing...' : isEditing ? <><Check className="w-4 h-4" /> Save</> : <><Edit2 className="w-4 h-4" /> Edit</>}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> ईमेल
                </label>
                <p className="font-bold text-gray-800 bg-slate-50 p-4 rounded-2xl border border-gray-100">{user.email}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> मोबाइल नंबर
                </label>
                {isEditing ? (
                  <input 
                    type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full font-bold text-gray-800 bg-white p-4 rounded-2xl border border-blue-500 focus:outline-none ring-4 ring-blue-500/5"
                  />
                ) : (
                  <p className="font-bold text-gray-800 bg-slate-50 p-4 rounded-2xl border border-gray-100">{user.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> पता (Address)
                </label>
                {isEditing ? (
                  <textarea 
                    value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full font-bold text-gray-800 bg-white p-4 rounded-2xl border border-blue-500 focus:outline-none ring-4 ring-blue-500/5 min-h-[100px]"
                  />
                ) : (
                  <p className="font-bold text-gray-800 bg-slate-50 p-4 rounded-2xl border border-gray-100">{user.address || 'Address not added yet.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h4 className="font-black text-gray-800 uppercase tracking-tight">Security Status</h4>
            <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">आपका अकाउंट पूरी तरह से सुरक्षित है और Firebase Authentication से जुड़ा हुआ है।</p>
            <div className="mt-6 pt-6 border-t border-gray-50">
              <div className="flex justify-between items-center text-xs mb-4">
                <span className="font-bold text-gray-400">2FA Status</span>
                <span className="bg-red-50 text-red-600 font-black px-2 py-1 rounded text-[9px] uppercase">Off</span>
              </div>
              <button className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
