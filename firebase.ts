import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  getDocs,
  where,
  runTransaction
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // पक्का करें कि यहाँ से auth और db आ रहा है
import { UserProfile, Transaction } from './types';

// --- AUTH SECTION ---

// यूजर की लॉगिन स्टेट चेक करने के लिए
export const onAuthStateChanged = (unusedAuth: any, callback: (user: any) => void) => {
  return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // यूजर लॉगिन है, Firestore से उसका पूरा डेटा लाएं
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        callback({ ...userDoc.data(), uid: firebaseUser.uid });
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

export const signupUser = async (name: string, email: string, pass: string, mobile: string): Promise<UserProfile> => {
  try {
    // 1. Firebase Auth में अकाउंट बनाना
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = userCredential.user.uid;

    const newUser: UserProfile = {
      uid: uid,
      email: email.toLowerCase(),
      displayName: name,
      mobile: mobile,
      walletBalance: 0,
      isAdmin: email.toLowerCase() === 'harsh.maurya101112@gmail.com',
      createdAt: new Date().toISOString()
    };

    // 2. Firestore डेटाबेस में यूजर प्रोफाइल सेव करना
    await setDoc(doc(db, "users", uid), newUser);
    return newUser;
  } catch (error: any) {
    throw { code: error.code, message: error.message };
  }
};

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    
    if (!userDoc.exists()) throw new Error("User data not found");
    return userDoc.data() as UserProfile;
  } catch (error: any) {
    throw { code: error.code, message: "Invalid email or password" };
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

// --- DATABASE / WALLET SECTION ---

// रियल-टाइम यूजर डेटा (Balance आदि) के लिए
export const onSnapshotUser = (uid: string, callback: (data: any) => void) => {
  return onSnapshot(doc(db, "users", uid), (snapshot) => {
    callback({ exists: () => snapshot.exists(), data: () => snapshot.data() });
  });
};

// वॉलेट अपडेट (Transaction के साथ)
export const updateWalletOnDB = async (uid: string, amount: number, service: string, type: 'debit' | 'credit', pin?: string) => {
  const userRef = doc(db, "users", uid);
  
  return await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) throw new Error("User not found");

    const userData = userDoc.data();
    if (type === 'debit' && userData.walletPin && pin !== userData.walletPin) throw new Error("Wrong PIN");
    if (type === 'debit' && userData.walletBalance < amount) throw new Error("Insufficient Balance");

    const oldBal = userData.walletBalance;
    const newBal = type === 'debit' ? oldBal - amount : oldBal + amount;

    // 1. बैलेंस अपडेट करें
    transaction.update(userRef, { walletBalance: newBal });

    // 2. हिस्ट्री में ट्रांजैक्शन रिकॉर्ड जोड़ें
    const txRef = doc(collection(db, "users", uid, "history"));
    const tx: Transaction = {
      id: txRef.id,
      serviceName: service,
      amount,
      type,
      date: new Date().toLocaleString(),
      status: 'success',
      prevBalance: oldBal,
      newBalance: newBal
    };
    transaction.set(txRef, tx);

    return tx;
  });
};

// हिस्ट्री सुनने के लिए (Real-time)
export const onSnapshotCollection = (refObj: any, callback: (snap: any) => void) => {
  const uid = refObj.path[1];
  const q = query(collection(db, "users", uid, "history"), orderBy("date", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    callback({ docs: snapshot.docs.map(d => ({ data: () => d.data() })) });
  });
};

// --- ADMIN SECTION ---

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => doc.data());
};

export const adminUpdateUser = async (uid: string, data: any) => {
  await updateDoc(doc(db, "users", uid), data);
};

export const setWalletPinDB = async (uid: string, pin: string) => {
  await updateDoc(doc(db, "users", uid), { walletPin: pin });
};
