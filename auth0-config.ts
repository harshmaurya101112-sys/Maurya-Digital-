
/**
 * Auth0 Configuration for Maurya Portal
 * 
 * Secure implementation using Environment Variables.
 * Values are fetched from Vercel/Environment at runtime.
 */

export const auth0Config = {
  // Vercel Dashboard mein 'VITE_AUTH0_DOMAIN' naam se save karein
  domain: (import.meta as any).env.VITE_AUTH0_DOMAIN || "dev-placeholder.auth0.com", 
  
  // Vercel Dashboard mein 'VITE_AUTH0_CLIENT_ID' naam se save karein
  clientId: (import.meta as any).env.VITE_AUTH0_CLIENT_ID || "PLACEHOLDER_CLIENT_ID",
  
  authorizationParams: {
    redirect_uri: window.location.origin,
    scope: "openid profile email"
  }
};
