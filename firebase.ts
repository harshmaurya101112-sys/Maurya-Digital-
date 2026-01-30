
import { UserProfile, Transaction } from './types';

// Simulated Database Storage
const DB_KEYS = {
  USERS: 'maurya_users',
  SESSION: 'maurya_active_session',
  HISTORY: 'maurya_history_'
};

const getFromStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- MOCK AUTH ---
export const auth = {
  currentUser: null as any
};

type AuthCallback = (user: any) => void;
const authListeners: AuthCallback[] = [];

export const onAuthStateChanged = (authObj: any, callback: AuthCallback) => {
  authListeners.push(callback);
  
  // Initial check for session
  const sessionUid = localStorage.getItem(DB_KEYS.SESSION);
  if (sessionUid) {
    const users = getFromStorage(DB_KEYS.USERS) || [];
    const user = users.find((u: any) => u.uid === sessionUid);
    if (user) {
      callback(user);
    } else {
      callback(null);
    }
  } else {
    callback(null);
  }
  
  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) authListeners.splice(index, 1);
  };
};

const MASTER_ADMIN_EMAIL = 'harsh.maurya101112@gmail.com';

export const signupUser = async (name: string, email: string, pass: string, mobile: string): Promise<UserProfile> => {
  await new Promise(r => setTimeout(r, 800));
  const users = getFromStorage(DB_KEYS.USERS) || [];
  
  if (users.find((u: any) => u.email === email)) {
    throw { code: 'auth/email-already-in-use', message: 'ईमेल पहले से मौजूद है' };
  }

  const isAdmin = email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
  const newUser: UserProfile = {
    uid: 'USR' + Date.now(),
    email: email.toLowerCase(),
    displayName: name,
    mobile: mobile,
    address: "",
    walletBalance: 0,
    isAdmin: isAdmin,
    createdAt: new Date().toISOString()
  };

  users.push({ ...newUser, password: pass });
  saveToStorage(DB_KEYS.USERS, users);
  saveToStorage(DB_KEYS.SESSION, newUser.uid);
  
  authListeners.forEach(cb => cb(newUser));
  return newUser;
};

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
  await new Promise(r => setTimeout(r, 800));
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const found = users.find((u: any) => u.email === email.toLowerCase() && u.password === pass);

  if (!found) {
    throw { code: 'auth/invalid-credential', message: 'ईमेल या पासवर्ड गलत है' };
  }

  const { password, ...userData } = found;
  saveToStorage(DB_KEYS.SESSION, userData.uid);
  authListeners.forEach(cb => cb(userData));
  return userData as UserProfile;
};

export const logoutUser = async () => {
  localStorage.removeItem(DB_KEYS.SESSION);
  authListeners.forEach(cb => cb(null));
};

// --- MOCK FIRESTORE ---
export const db = {};

export const doc = (db: any, collection: string, id: string) => ({ collection, id });

const docListeners: Record<string, ((snap: any) => void)[]> = {};

export const onSnapshot = (docRef: any, callback: (snap: any) => void) => {
  const path = `${docRef.collection}/${docRef.id}`;
  if (!docListeners[path]) docListeners[path] = [];
  docListeners[path].push(callback);

  // Initial trigger
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const user = users.find((u: any) => u.uid === docRef.id);
  callback({ 
    exists: () => !!user, 
    data: () => user 
  });

  return () => {
    docListeners[path] = docListeners[path].filter(cb => cb !== callback);
  };
};

const notifyDocChange = (uid: string) => {
  const path = `users/${uid}`;
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const user = users.find((u: any) => u.uid === uid);
  if (docListeners[path]) {
    docListeners[path].forEach(cb => cb({ 
      exists: () => !!user, 
      data: () => user 
    }));
  }
};

export const updateDoc = async (docRef: any, data: any) => {
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const idx = users.findIndex((u: any) => u.uid === docRef.id);
  if (idx > -1) {
    users[idx] = { ...users[idx], ...data };
    saveToStorage(DB_KEYS.USERS, users);
    notifyDocChange(docRef.id);
  }
};

export const setDoc = updateDoc;

export const updateWalletOnDB = async (uid: string, amount: number, serviceName: string, type: 'debit' | 'credit', pin?: string) => {
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const userIdx = users.findIndex((u: any) => u.uid === uid);
  if (userIdx === -1) throw new Error("यूजर नहीं मिला");

  const userData = users[userIdx];
  if (type === 'debit' && userData.walletPin && pin !== userData.walletPin) throw new Error("गलत पिन");
  if (type === 'debit' && userData.walletBalance < amount) throw new Error("बैलेंस कम है");

  const prevBalance = userData.walletBalance;
  const newBalance = type === 'debit' ? prevBalance - amount : prevBalance + amount;
  
  users[userIdx].walletBalance = newBalance;
  saveToStorage(DB_KEYS.USERS, users);

  const tx: Transaction = {
    id: 'TXN' + Date.now(),
    serviceName,
    amount,
    type,
    date: new Date().toLocaleString(),
    status: 'success',
    prevBalance,
    newBalance
  };

  const historyKey = DB_KEYS.HISTORY + uid;
  const history = getFromStorage(historyKey) || [];
  history.unshift(tx);
  saveToStorage(historyKey, history);

  notifyDocChange(uid);
  return { newBalance, tx };
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  return getFromStorage(DB_KEYS.USERS) || [];
};

export const adminUpdateUser = async (uid: string, data: any) => {
  await updateDoc({ id: uid }, data);
};

export const makeUserAdmin = async (uid: string) => {
  await updateDoc({ id: uid }, { isAdmin: true });
};

export const setWalletPinDB = async (uid: string, pin: string) => {
  await updateDoc({ id: uid }, { walletPin: pin });
};

export const processSecurePayment = async (amt: number) => {
  await new Promise(r => setTimeout(r, 1000));
  return true;
};

// Mock collection/query for Wallet History
export const collection = (db: any, ...path: string[]) => ({ path });
export const query = (...args: any[]) => args[0];
export const orderBy = (...args: any[]) => ({});
export const limit = (...args: any[]) => ({});

export const onSnapshotCollection = (collectionRef: any, callback: (snap: any) => void) => {
  const uid = collectionRef.path[1]; // users/UID/history
  const historyKey = DB_KEYS.HISTORY + uid;
  
  const trigger = () => {
    const data = getFromStorage(historyKey) || [];
    callback({
      docs: data.map((d: any) => ({ data: () => d }))
    });
  };

  trigger();
  // Simple polling for mock updates
  const interval = setInterval(trigger, 2000);
  return () => clearInterval(interval);
};
