
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot, 
  collection, query, addDoc, getDocs, deleteDoc, where 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { UserProfile, Transaction } from './types';

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// HARDCODED MASTER ADMIN
const MASTER_ADMIN_EMAIL = 'harsh.maurya101112@gmail.com';

export const syncAuth0UserToFirebase = async (auth0User: any) => {
  if (!auth0User) return null;
  
  const cleanEmail = auth0User.email.toLowerCase().trim();
  const userId = auth0User.sub || cleanEmail.replace(/[@.]/g, '_');
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  
  // Strict Admin Check
  const isAdmin = cleanEmail === MASTER_ADMIN_EMAIL;
  
  const profileData: Partial<UserProfile> = {
    uid: userId,
    email: cleanEmail,
    displayName: auth0User.name || 'Merchant Partner',
    photoURL: auth0User.picture || '',
    isAdmin: isAdmin,
  };

  if (!snap.exists()) {
    const newProfile: UserProfile = {
      ...(profileData as UserProfile),
      walletBalance: 0,
      createdAt: new Date().toISOString()
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    // Force update admin status to prevent any tampering
    await updateDoc(userRef, profileData);
    return { ...snap.data(), ...profileData } as UserProfile;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const updateWalletOnDB = async (uid: string, amount: number, service: string, type: 'debit' | 'credit', pin?: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User record missing");
  const userData = userSnap.data() as UserProfile;

  if (type === 'debit') {
    if (userData.walletPin && pin !== userData.walletPin) throw new Error("Incorrect Wallet PIN");
    if (userData.walletBalance < amount) throw new Error("Insufficient Balance");
  }

  const newBal = type === 'debit' ? userData.walletBalance - amount : userData.walletBalance + amount;
  await updateDoc(userRef, { walletBalance: newBal });

  await addDoc(collection(db, "users", uid, "history"), {
    id: 'TX' + Date.now(),
    serviceName: service,
    amount,
    type,
    date: new Date().toLocaleString(),
    status: 'success',
    prevBalance: userData.walletBalance,
    newBalance: newBal
  });
};

export const adminUpdateUser = async (uid: string, data: any) => {
  await updateDoc(doc(db, "users", uid), data);
};

export const makeUserAdmin = async (uid: string) => {
  // Logic still restricted to profile sync but added for UI consistency
  await updateDoc(doc(db, "users", uid), { isAdmin: true });
};

export const processSecurePayment = async (amount: number) => {
  await new Promise(res => setTimeout(res, 1500));
  return true;
};

export const setWalletPinDB = async (uid: string, pin: string) => {
  await updateDoc(doc(db, "users", uid), { walletPin: pin });
};

export const deleteUserDB = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};

export { doc, onSnapshot, collection, query, where, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc };
