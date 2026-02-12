// Variables ko safely fetch karein
const rawDomain = import.meta.env.VITE_AUTH0_DOMAIN || "";
const rawClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "";

// Safe domain cleaner - crash se bachne ke liye
const getCleanDomain = (url: string) => {
  if (!url) return "";
  return url.replace(/^https?:\/\//, '').split('/')[0].trim();
};

export const auth0Config: any = {
  domain: getCleanDomain(rawDomain),
  clientId: rawClientId.trim(),
  authorizationParams: {
    // Mobile browsers ke liye safer approach
    redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
    scope: "openid profile email"
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
  useRefreshTokensFallback: true,
};

// Console log sirf debug ke liye (Vercel logs mein dikhega)
console.log("Auth0 Config Check:", { 
  domain: !!auth0Config.domain, 
  clientId: !!auth0Config.clientId 
});
