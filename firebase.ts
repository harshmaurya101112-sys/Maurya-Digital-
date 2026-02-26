
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot, 
  collection, query, addDoc, getDocs, deleteDoc, where 
} from 'firebase/firestore';
import { UserProfile } from './types';

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
  databaseURL: (import.meta as any).env.VITE_FIREBASE_DATABASE_URL,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate config before initializing
const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

if (!isConfigValid) {
  console.warn("Firebase configuration is missing. Please set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your environment.");
}

const app = isConfigValid ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : ({} as any);
export const db = app ? getFirestore(app) : ({} as any);
export { isConfigValid };

const MASTER_ADMIN_EMAIL = 'harsh.maurya101112@gmail.com';

export const syncUserToFirestore = async (firebaseUser: any) => {
  if (!firebaseUser) return null;
  
  try {
    const cleanEmail = firebaseUser.email.toLowerCase().trim();
    const userId = firebaseUser.uid;
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    
    const isAdmin = cleanEmail === MASTER_ADMIN_EMAIL;
    
    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid: userId,
        email: cleanEmail,
        displayName: firebaseUser.displayName || 'Merchant Partner',
        photoURL: firebaseUser.photoURL || '',
        isAdmin: isAdmin,
        walletBalance: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const existingData = snap.data();
      // Refresh admin status just in case
      await updateDoc(userRef, { isAdmin });
      return { ...existingData, isAdmin } as UserProfile;
    }
  } catch (err) {
    console.error("Firestore Sync Error:", err);
    throw err;
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

// Added deleteUserDB to resolve import error in Admin.tsx
export const deleteUserDB = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};

export const processSecurePayment = async (amount: number) => {
  await new Promise(res => setTimeout(res, 1500));
  return true;
};

export const setWalletPinDB = async (uid: string, pin: string) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { walletPin: pin }, { merge: true });
};

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  updateProfile,
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc 
};
