
/**
 * Auth0 Configuration
 * Replace the values below with your actual credentials from the Auth0 Dashboard.
 * Dashboard: https://manage.auth0.com/
 */

export const auth0Config = {
  // Your Auth0 Domain (e.g., 'dev-abc123.us.auth0.com')
  domain: "dev-your-domain.auth0.com", 
  
  // Your Auth0 Client ID
  clientId: "YOUR_CLIENT_ID_FROM_DASHBOARD",
  
  // The URL to redirect back to after login
  authorizationParams: {
    redirect_uri: window.location.origin,
    // Optional: audience: "https://your-api-identifier",
    // Optional: scope: "openid profile email"
  }
};

/**
 * Note: To use these in your code, you would typically install @auth0/auth0-react
 * and wrap your App in <Auth0Provider {...auth0Config}>
 */
