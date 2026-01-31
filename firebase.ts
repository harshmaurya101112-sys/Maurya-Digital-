
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

// SECURITY: Using process.env.API_KEY to prevent leakage.
// Make sure to add 'API_KEY' in your Vercel Environment Variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export default firebaseConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * PERSISTENCE SETTING:
 * This ensures that when the page is refreshed, Firebase checks the saved session.
 */
setPersistence(auth, browserLocalPersistence)
  .then(() => console.debug("Auth persistence: ACTIVE"))
  .catch((err) => console.error("Persistence error:", err));

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
  if (!userDoc.exists()) throw new Error("Database profile not found.");
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
