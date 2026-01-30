
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

// NOTE: These IDs should match your actual Firebase project settings
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

/**
 * Creates or updates a user profile in Firestore
 */
const saveUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, data, { merge: true });
};

export const signupUser = async (name: string, email: string, pass: string, mobile: string): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name });

    const isAdmin = email.toLowerCase().trim() === MASTER_ADMIN_EMAIL.toLowerCase();

    const userData: UserProfile = {
      uid: user.uid,
      email: email.toLowerCase().trim(),
      displayName: name,
      mobile: mobile,
      address: "",
      walletBalance: 0,
      isAdmin: isAdmin,
      createdAt: new Date().toISOString()
    };

    await saveUserProfile(user.uid, userData);
    
    if (isAdmin) {
      await setDoc(doc(db, "admins", user.uid), { 
        grantedAt: new Date().toISOString(), 
        type: 'master' 
      });
    }
    
    return userData;
  } catch (error: any) {
    console.error("Signup Error:", error);
    throw error;
  }
};

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const user = userCredential.user;
    const docSnap = await getDoc(doc(db, "users", user.uid));
    
    const isMasterAdmin = email.toLowerCase().trim() === MASTER_ADMIN_EMAIL.toLowerCase();

    // Self-healing: If profile doesn't exist, create a basic one
    if (!docSnap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || email.toLowerCase().trim(),
        displayName: user.displayName || "User",
        walletBalance: 0,
        isAdmin: isMasterAdmin,
        createdAt: new Date().toISOString()
      };
      await saveUserProfile(user.uid, newProfile);
      return newProfile;
    }
    
    const userData = docSnap.data() as UserProfile;
    
    // Ensure admin status is always synced with master email
    if (isMasterAdmin && !userData.isAdmin) {
      await updateDoc(doc(db, "users", user.uid), { isAdmin: true });
      userData.isAdmin = true;
    }
    
    return userData;
  } catch (error: any) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const setWalletPinDB = async (uid: string, pin: string) => {
  await updateDoc(doc(db, "users", uid), { walletPin: pin });
};

export const processSecurePayment = async (amount: number): Promise<boolean> => {
  // Simulation layer for future API integration
  await new Promise(r => setTimeout(r, 1200));
  return true;
};

export const updateWalletOnDB = async (uid: string, amount: number, serviceName: string, type: 'debit' | 'credit', pin?: string) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) throw new Error("यूजर प्रोफाइल नहीं मिला!");
  const userData = docSnap.data() as UserProfile;

  if (type === 'debit' && userData.walletPin && pin !== userData.walletPin) {
    throw new Error("गलत वॉलेट पिन!");
  }

  const prevBalance = userData.walletBalance || 0;
  if (type === 'debit' && prevBalance < amount) throw new Error("वॉलेट में बैलेंस पर्याप्त नहीं है!");

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

export const makeUserAdmin = async (targetUid: string) => {
  await updateDoc(doc(db, "users", targetUid), { isAdmin: true });
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(d => d.data() as UserProfile);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return [];
  }
};
