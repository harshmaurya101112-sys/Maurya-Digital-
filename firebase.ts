
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
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
  arrayUnion,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { UserProfile, Transaction } from './types';

// अपनी एडमिन ईमेल यहाँ बदलें (Replace with your own email)
const ADMIN_EMAIL = 'admin@maurya.com'; 

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signupUser = async (name: string, email: string, pass: string): Promise<UserProfile> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  
  await updateProfile(user, { displayName: name });

  const userData: UserProfile = {
    uid: user.uid,
    email: email,
    displayName: name,
    walletBalance: 0,
    transactions: [],
    // यहाँ एडमिन चेक होता है
    isAdmin: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() 
  };

  await setDoc(doc(db, "users", user.uid), userData);
  return userData;
};

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  const docSnap = await getDoc(doc(db, "users", user.uid));
  return docSnap.data() as UserProfile;
};

export const logoutUser = () => signOut(auth);

export const updateWalletOnDB = async (uid: string, amount: number, serviceName: string, type: 'debit' | 'credit', note: string = "Automatic") => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) return null;
  const currentData = docSnap.data() as UserProfile;
  
  const prevBalance = currentData.walletBalance;
  const newBalance = type === 'debit' ? prevBalance - amount : prevBalance + amount;
  
  const newTransaction: Transaction = {
    id: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    serviceName: note !== "Automatic" ? `${serviceName} (${note})` : serviceName,
    amount,
    type,
    date: new Date().toLocaleString('hi-IN'),
    status: 'success',
    prevBalance,
    newBalance
  };

  await updateDoc(userRef, {
    walletBalance: newBalance,
    transactions: [newTransaction, ...currentData.transactions].slice(0, 50)
  });

  return { newBalance, newTransaction };
};

export const updateUserBio = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  const users: UserProfile[] = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data() as UserProfile);
  });
  return users;
};
