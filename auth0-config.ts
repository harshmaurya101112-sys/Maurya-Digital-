
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
  // CRITICAL: This allows session to persist after refresh without 3rd party cookies
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
  useRefreshTokensFallback: true,
  legacySameSiteCookie: true
};

if (!cleanDomain || !rawClientId) {
  console.error("CRITICAL: Auth0 Keys are missing in environment variables!");
}
