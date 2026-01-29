
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs,
  collection,
  setDoc, 
  updateDoc,
  query
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { UserProfile, Transaction } from './types';

// --- CONFIGURATION ---
export const ADMIN_EMAIL = 'harsh.maurya101112@gmail.com'; 

const getEnv = (key: string) => {
  // Vite specific environment check
  // @ts-ignore
  return (import.meta as any).env?.[key] || (typeof process !== 'undefined' && process.env?.[key]) || "";
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// Check if config exists
export const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;

let auth: any = null;
let db: any = null;

if (isConfigValid) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase Init Failed:", error);
  }
}

export { auth, db };

export const signupUser = async (name: string, email: string, pass: string): Promise<UserProfile> => {
  if (!auth) throw new Error("Firebase Setup Missing");
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  await updateProfile(user, { displayName: name });
  const userData: UserProfile = {
    uid: user.uid,
    email: email,
    displayName: name,
    walletBalance: 0,
    transactions: [],
    isAdmin: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() 
  };
  await setDoc(doc(db, "users", user.uid), userData);
  return userData;
};

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
  if (!auth) throw new Error("Firebase Setup Missing");
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const docSnap = await getDoc(doc(db, "users", userCredential.user.uid));
  return docSnap.data() as UserProfile;
};

export const logoutUser = () => auth && signOut(auth);

export const updateWalletOnDB = async (uid: string, amount: number, serviceName: string, type: 'debit' | 'credit', note: string = "Automatic") => {
  if (!db) return null;
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) return null;
  const currentData = docSnap.data() as UserProfile;
  const newBalance = type === 'debit' ? currentData.walletBalance - amount : currentData.walletBalance + amount;
  const newTransaction: Transaction = {
    id: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    serviceName: note !== "Automatic" ? `${serviceName} (${note})` : serviceName,
    amount, type,
    date: new Date().toLocaleString('hi-IN'),
    status: 'success',
    prevBalance: currentData.walletBalance,
    newBalance
  };
  await updateDoc(userRef, {
    walletBalance: newBalance,
    transactions: [newTransaction, ...currentData.transactions].slice(0, 50)
  });
  return { newBalance, newTransaction };
};

export const updateUserBio = async (uid: string, data: Partial<UserProfile>) => {
  if (db) await updateDoc(doc(db, "users", uid), data);
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  if (!db) return [];
  const querySnapshot = await getDocs(query(collection(db, "users")));
  return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};
