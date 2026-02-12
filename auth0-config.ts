
/**
 * Auth0 Configuration for Maurya Portal
 */

const rawDomain = (import.meta as any).env.VITE_AUTH0_DOMAIN || "";
const rawClientId = (import.meta as any).env.VITE_AUTH0_CLIENT_ID || "";

// Clean domain to ensure it's just the hostname (dev-xxxx.us.auth0.com)
const cleanDomain = rawDomain
  .replace('https://', '')
  .replace('http://', '')
  .split('/')[0]
  .trim();

export const auth0Config: any = {
  domain: cleanDomain, 
  clientId: rawClientId.trim(),
  authorizationParams: {
    redirect_uri: window.location.origin,
    scope: "openid profile email"
  },
  // Cache in localstorage keeps session alive after refresh
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
  // Required for cross-domain on some browsers
  useRefreshTokensFallback: true
};

if (!cleanDomain || !rawClientId) {
  console.error("CRITICAL: Auth0 Keys are missing in environment variables!");
}
