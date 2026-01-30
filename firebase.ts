
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  getDocs,
  addDoc,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { UserProfile, Transaction } from './types';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "maurya-portal.firebaseapp.com",
  projectId: "maurya-portal",
  storageBucket: "maurya-portal.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const MASTER_ADMIN_EMAIL = 'harsh.maurya101112@gmail.com';

export const signupUser = async (name: string, email: string, pass: string, mobile: string): Promise<UserProfile> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  await updateProfile(user, { displayName: name });

  const isAdmin = email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

  const userData: UserProfile = {
    uid: user.uid,
    email: email.toLowerCase(),
    displayName: name,
    mobile: mobile,
    address: "",
    walletBalance: 0,
    isAdmin: isAdmin,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, "users", user.uid), userData);
  if (isAdmin) {
    await setDoc(doc(db, "admins", user.uid), { grantedAt: new Date().toISOString(), type: 'master' });
  }
  return userData;
};

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  const docSnap = await getDoc(doc(db, "users", user.uid));
  
  if (!docSnap.exists()) throw new Error("User data not found");
  const userData = docSnap.data() as UserProfile;
  
  // Re-verify Admin status
  const isAdmin = email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
  if (isAdmin !== userData.isAdmin) {
    await updateDoc(doc(db, "users", user.uid), { isAdmin });
    userData.isAdmin = isAdmin;
  }
  
  return userData;
};

export const setWalletPinDB = async (uid: string, pin: string) => {
  await updateDoc(doc(db, "users", uid), { walletPin: pin });
};

// SIMULATED SECURE PAYMENT GATEWAY (Future: Integrate Razorpay/PayTM here)
export const processSecurePayment = async (amount: number): Promise<boolean> => {
  // Simulate network delay for verification
  await new Promise(r => setTimeout(r, 2000));
  // Validation Logic (Simulated)
  const isPaymentValid = true; // This would come from a Gateway Webhook/API
  return isPaymentValid;
};

export const updateWalletOnDB = async (uid: string, amount: number, serviceName: string, type: 'debit' | 'credit', pin?: string) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) throw new Error("User not found");
  const userData = docSnap.data() as UserProfile;

  // PIN Verification for security
  if (userData.walletPin && pin !== userData.walletPin) {
    throw new Error("गलत वॉलेट पिन! (Incorrect PIN)");
  }

  const prevBalance = userData.walletBalance;
  if (type === 'debit' && prevBalance < amount) throw new Error("अपर्याप्त बैलेंस!");

  const newBalance = type === 'debit' ? prevBalance - amount : prevBalance + amount;
  
  const newTx: Transaction = {
    id: "TXN" + Date.now(),
    serviceName,
    amount,
    type,
    date: new Date().toLocaleString('hi-IN'),
    status: 'success',
    prevBalance,
    newBalance
  };

  await updateDoc(userRef, { walletBalance: newBalance });
  await addDoc(collection(db, "users", uid, "history"), newTx);
  
  return { newBalance, newTx };
};

export const logoutUser = () => signOut(auth);

export const adminUpdateUser = async (targetUid: string, data: Partial<UserProfile>) => {
  await updateDoc(doc(db, "users", targetUid), data);
};

// Fixed error in pages/Admin.tsx: added missing makeUserAdmin function
export const makeUserAdmin = async (targetUid: string) => {
  await updateDoc(doc(db, "users", targetUid), { isAdmin: true });
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => d.data() as UserProfile);
};
