
/**
 * Auth0 Configuration for Maurya Portal
 * 
 * Secure implementation using Environment Variables.
 */

const rawDomain = (import.meta as any).env.VITE_AUTH0_DOMAIN || "";
const rawClientId = (import.meta as any).env.VITE_AUTH0_CLIENT_ID || "";

// Remove https:// if accidentally added by user in Vercel settings
const cleanDomain = rawDomain.replace('https://', '').replace('http://', '').split('/')[0];

export const auth0Config: any = {
  domain: cleanDomain, 
  clientId: rawClientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
    scope: "openid profile email"
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};

// Debug helper (Console mein check karein agar keys empty aa rahi hain)
if (!rawDomain || !rawClientId) {
  console.warn("Auth0 Keys Missing in Environment Variables!");
}
