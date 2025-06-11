import { GOOGLE_OAUTH_CONFIG } from '../config/googleOAuth';
import api from './api';

const { CLIENT_ID, REDIRECT_URI, SCOPES } = GOOGLE_OAUTH_CONFIG;
const SCOPES_STRING = SCOPES.join(' ');

// Debug function to check configuration
export const debugOAuthConfig = () => {
  console.log('OAuth Configuration:');
  console.log('CLIENT_ID:', CLIENT_ID);
  console.log('REDIRECT_URI:', REDIRECT_URI);
  console.log('SCOPES:', SCOPES);
  console.log('Environment variables:');
  console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID || 'NOT SET');
};

export const handleGoogleCallback = () => {
  // Check if we're on the callback page with an authorization code
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return { error };
  }

  if (code) {
    return { code };
  }

  return null;
};

// OAuth flow using direct authorization URL
export const initiateGoogleOAuth = () => {
  // Validate configuration before creating URL
  if (!CLIENT_ID || CLIENT_ID === 'your_google_client_id_here') {
    throw new Error('Google OAuth CLIENT_ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable or update the config file.');
  }

  const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
    `client_id=${encodeURIComponent(CLIENT_ID)}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(SCOPES_STRING)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent&` +
    `include_granted_scopes=true`;

  console.log('OAuth URL:', authUrl);
  console.log('CLIENT_ID being used:', CLIENT_ID);
  console.log('REDIRECT_URI being used:', REDIRECT_URI);
  
  window.location.href = authUrl;
};

// Exchange authorization code for tokens via backend
export const exchangeCodeForTokens = async (code) => {
  try {
    console.log('Exchanging code for tokens via backend...');
    console.log('Code:', code);
    console.log('Making request to:', '/oauth/google/callback');

    const response = await api.post('/oauth/google/callback', {
      code: code
    });

    console.log('Backend token exchange successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        `HTTP ${error.response?.status}: ${error.response?.statusText}` ||
                        'Failed to exchange code for tokens';
    
    throw new Error(errorMessage);
  }
}; 