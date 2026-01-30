
// Yeh file ab ek nakli database (Simulated DB) ki tarah kaam karegi
// Taaki aapka Login aur Sign Up ka experience asli Firebase jaisa ho

const GET_USERS = () => {
  const users = localStorage.getItem('maurya_db_users');
  return users ? JSON.parse(users) : [];
};

const SAVE_USER = (user: any) => {
  const users = GET_USERS();
  users.push(user);
  localStorage.setItem('maurya_db_users', JSON.stringify(users));
};

export const loginUser = async (email: string, pass: string) => {
  await new Promise(res => setTimeout(res, 800)); // Network delay simulation
  
  const users = GET_USERS();
  const foundUser = users.find((u: any) => u.email === email && u.password === pass);
  
  if (!foundUser) {
    // Agar user nahi mila toh error throw karein
    throw new Error('auth/user-not-found-or-wrong-password');
  }
  
  // Sensitive data (password) ko return nahi karna chahiye
  const { password, ...userWithoutPassword } = foundUser;
  return userWithoutPassword;
};

export const signupUser = async (name: string, email: string, pass: string) => {
  await new Promise(res => setTimeout(res, 1000));
  
  const users = GET_USERS();
  if (users.find((u: any) => u.email === email)) {
    throw new Error('auth/email-already-in-use');
  }

  const newUser = { name, email, password: pass, uid: Date.now().toString() };
  SAVE_USER(newUser);
  
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};
