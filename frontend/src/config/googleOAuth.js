export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  REDIRECT_URI: 'https://fetchr.pro/profile',

  // GMAIL API + USER PROFILE SCOPES (without OpenID Connect)
  SCOPES: [
    'email',                                             // User's email address
    'profile',                                           // User's basic profile info
    'https://www.googleapis.com/auth/gmail.readonly',    // Read Gmail messages
    'https://www.googleapis.com/auth/gmail.compose'      // Send Gmail messages
  ]
};