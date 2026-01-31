
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendEmailVerification,
  browserLocalPersistence,
  setPersistence
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  addDoc,
  getDocs,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { UserProfile, Transaction } from './types';

/**
 * CONFIGURATION GUIDE:
 * 1. Go to Vercel Dashboard -> Settings -> Environment Variables.
 * 2. Key: API_KEY
 * 3. Value: [Paste your Firebase Web API Key here]
 */
const firebaseConfig = {
  // Use the exact environment variable name provided by the platform
  apiKey: process.env.API_KEY || "AIzaSy_YOUR_FALLBACK_KEY_IF_NEEDED", 
  authDomain: "maurya-portal.firebaseapp.com",
  projectId: "maurya-portal",
  storageBucket: "maurya-portal.appspot.com",
  messagingSenderId: "789456123",
  appId: "1:789456123:web:abc123def"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Force Browser to remember the login session even after page refresh
setPersistence(auth, browserLocalPersistence)
  .then(() => console.debug("Auth persistence enabled: Local"))
  .catch(err => console.error("Persistence Error:", err));

export const onAuthStateChangedListener = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signupUser = async (name: string, email: string, pass: string, mobile: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  await sendEmailVerification(user);

  const profile: UserProfile = {
    uid: user.uid,
    email: email.toLowerCase(),
    displayName: name,
    mobile: mobile,
    walletBalance: 0,
    isAdmin: email.toLowerCase() === 'harsh.maurya101112@gmail.com',
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, "users", user.uid), profile);
  return profile;
};

export const loginUser = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
  if (!userDoc.exists()) throw new Error("User record missing in Database.");
  return userDoc.data() as UserProfile;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export { doc, onSnapshot, updateDoc, collection };

export const processSecurePayment = async (amount: number) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return true;
};

export const setWalletPinDB = async (uid: string, pin: string) => {
  await updateDoc(doc(db, "users", uid), { walletPin: pin });
};

export const onSnapshotCollection = (ref: any, callback: any) => {
  return onSnapshot(ref, callback);
};

export const updateWalletOnDB = async (uid: string, amount: number, service: string, type: 'debit' | 'credit', pin?: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found");
  const userData = userSnap.data() as UserProfile;

  if (type === 'debit' && userData.walletPin && pin !== userData.walletPin) throw new Error("Wrong PIN");
  if (type === 'debit' && userData.walletBalance < amount) throw new Error("Insufficient Balance");

  const newBal = type === 'debit' ? userData.walletBalance - amount : userData.walletBalance + amount;
  await updateDoc(userRef, { walletBalance: newBal });

  const tx: Transaction = {
    id: 'TX' + Date.now(),
    serviceName: service,
    amount,
    type,
    date: new Date().toLocaleString(),
    status: 'success',
    prevBalance: userData.walletBalance,
    newBalance: newBal
  };

  await addDoc(collection(db, "users", uid, "history"), tx);
  return tx;
};

export const getAllUsers = async () => {
  const q = query(collection(db, "users"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as UserProfile);
};

export const deleteUserDB = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};

export const adminUpdateUser = async (uid: string, data: any) => {
  await updateDoc(doc(db, "users", uid), data);
};

export const makeUserAdmin = async (uid: string) => {
  await updateDoc(doc(db, "users", uid), { isAdmin: true });
};
