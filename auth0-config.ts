// 1. Safe Variable Fetching
const rawDomain = import.meta.env.VITE_AUTH0_DOMAIN || "";
const rawClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "";

// 2. Safe Cleaning (Agar variable khali hai toh crash nahi hoga)
const cleanDomain = rawDomain 
  ? rawDomain.replace(/^https?:\/\//, '').split('/')[0].trim() 
  : "";

export const auth0Config = {
  domain: cleanDomain,
  clientId: rawClientId.trim(),
  authorizationParams: {
    redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
    scope: "openid profile email"
  },
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true,
  useRefreshTokensFallback: true,
};

// 3. Ye alert aapko mobile screen par dikhayega agar config khali hai
if (typeof window !== 'undefined' && (!cleanDomain || !rawClientId)) {
  console.error("AUTH0_ERROR: Config Missing");
  // alert("Debug: Domain is " + (cleanDomain || "Empty") + " ClientId is " + (rawClientId || "Empty"));
}
