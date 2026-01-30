
import { UserProfile, Transaction } from './types';

const DB_KEYS = {
  USERS: 'maurya_portal_users_v4', // Incremented version to clear old inconsistent data
  SESSION: 'maurya_active_session_id',
  HISTORY: 'maurya_tx_history_v4_'
};

const getFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize session immediately on load
const savedSession = localStorage.getItem(DB_KEYS.SESSION);
export const auth = { 
  currentUser: savedSession ? { uid: savedSession } : null 
};

type AuthCallback = (user: any) => void;
const authListeners: AuthCallback[] = [];

export const onAuthStateChanged = (authObj: any, callback: AuthCallback) => {
  authListeners.push(callback);
  
  // Persistence Check
  const sessionUid = localStorage.getItem(DB_KEYS.SESSION);
  if (sessionUid) {
    const users = getFromStorage(DB_KEYS.USERS) || [];
    const user = users.find((u: any) => u.uid === sessionUid);
    if (user) {
      const { password, ...safeUser } = user;
      callback(safeUser);
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

export const signupUser = async (name: string, email: string, pass: string, mobile: string): Promise<UserProfile> => {
  const users = getFromStorage(DB_KEYS.USERS) || [];
  if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
    throw { code: 'auth/email-already-in-use', message: 'Email already exists' };
  }

  const newUser: UserProfile = {
    uid: 'USR' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    email: email.toLowerCase(),
    displayName: name,
    mobile: mobile,
    walletBalance: 0,
    isAdmin: email.toLowerCase() === 'harsh.maurya101112@gmail.com',
    createdAt: new Date().toISOString()
  };

  users.push({ ...newUser, password: pass });
  saveToStorage(DB_KEYS.USERS, users);
  localStorage.setItem(DB_KEYS.SESSION, newUser.uid);
  
  authListeners.forEach(cb => cb(newUser));
  return newUser;
};

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

  if (!found) {
    throw { code: 'auth/invalid-credential', message: 'Invalid email or password' };
  }

  const { password, ...userData } = found;
  localStorage.setItem(DB_KEYS.SESSION, userData.uid);
  authListeners.forEach(cb => cb(userData));
  return userData as UserProfile;
};

export const logoutUser = async () => {
  localStorage.removeItem(DB_KEYS.SESSION);
  authListeners.forEach(cb => cb(null));
};

export const db = {};
export const doc = (db: any, col: string, id: string) => ({ col, id });

export const onSnapshot = (docRef: any, callback: (snap: any) => void) => {
  const trigger = () => {
    const users = getFromStorage(DB_KEYS.USERS) || [];
    const user = users.find((u: any) => u.uid === docRef.id);
    callback({ exists: () => !!user, data: () => user });
  };
  trigger();
  // Simple polling for mock real-time
  const interval = setInterval(trigger, 2000);
  return () => clearInterval(interval);
};

export const updateDoc = async (docRef: any, data: any) => {
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const idx = users.findIndex((u: any) => u.uid === docRef.id);
  if (idx > -1) {
    users[idx] = { ...users[idx], ...data };
    saveToStorage(DB_KEYS.USERS, users);
  }
};

export const updateWalletOnDB = async (uid: string, amount: number, service: string, type: 'debit' | 'credit', pin?: string) => {
  const users = getFromStorage(DB_KEYS.USERS) || [];
  const idx = users.findIndex((u: any) => u.uid === uid);
  if (idx === -1) throw new Error("User not found");

  const user = users[idx];
  if (type === 'debit' && user.walletPin && pin !== user.walletPin) throw new Error("Wrong PIN");
  if (type === 'debit' && user.walletBalance < amount) throw new Error("Insufficient Balance");

  const oldBal = user.walletBalance;
  const newBal = type === 'debit' ? oldBal - amount : oldBal + amount;
  
  users[idx].walletBalance = newBal;
  saveToStorage(DB_KEYS.USERS, users);

  const tx: Transaction = {
    id: 'TX' + Date.now(),
    serviceName: service,
    amount,
    type,
    date: new Date().toLocaleString(),
    status: 'success',
    prevBalance: oldBal,
    newBalance: newBal
  };

  const hKey = DB_KEYS.HISTORY + uid;
  const history = getFromStorage(hKey) || [];
  history.unshift(tx);
  saveToStorage(hKey, history);

  return tx;
};

export const getAllUsers = async () => getFromStorage(DB_KEYS.USERS) || [];
export const adminUpdateUser = async (uid: string, data: any) => updateDoc({ id: uid }, data);
export const makeUserAdmin = async (uid: string) => updateDoc({ id: uid }, { isAdmin: true });
export const setWalletPinDB = async (uid: string, pin: string) => updateDoc({ id: uid }, { walletPin: pin });
export const processSecurePayment = async (amt: number) => true;

export const collection = (db: any, ...path: string[]) => ({ path });
export const onSnapshotCollection = (ref: any, callback: (snap: any) => void) => {
  const uid = ref.path[1];
  const trigger = () => {
    const data = getFromStorage(DB_KEYS.HISTORY + uid) || [];
    callback({ docs: data.map((d: any) => ({ data: () => d })) });
  };
  trigger();
  const interval = setInterval(trigger, 3000);
  return () => clearInterval(interval);
};
