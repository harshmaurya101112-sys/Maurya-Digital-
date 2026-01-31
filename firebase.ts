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

// Keep user logged in across refreshes
setPersistence(auth, browserLocalPersistence).catch(console.error);

export const onAuthStateChangedListener = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const resendVerification = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};

export const signupUser = async (name: string, email: string, pass: string, mobile: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  
  // IMMEDIATELY fire verification email
  try {
    await sendEmailVerification(user);
  } catch (e) {
    console.error("Verification email failed to send instantly", e);
  }

  const profile: UserProfile = {
    uid: user.uid,
    email: email.toLowerCase().trim(),
    displayName: name,
    mobile: mobile,
    walletBalance: 0,
    isAdmin: email.toLowerCase().trim() === 'harsh.maurya101112@gmail.com',
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, "users", user.uid), profile);
  return profile;
};

export const loginUser = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
  if (!userDoc.exists()) throw new Error("User record not found in Firestore.");
  return userDoc.data() as UserProfile;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export { doc, onSnapshot, updateDoc, collection };

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

export const setWalletPinDB = async (uid: string, pin: string) => {
  await updateDoc(doc(db, "users", uid), { walletPin: pin });
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

export const processSecurePayment = async (amount: number) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return true;
};

export const onSnapshotCollection = (ref: any, callback: any) => {
  return onSnapshot(ref, callback);
}