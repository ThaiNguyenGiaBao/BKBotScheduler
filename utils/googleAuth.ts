import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import api, { tokenManager } from '@/api';

// Ensure WebBrowser handles auth session redirects
WebBrowser.maybeCompleteAuthSession();

// Define Google's OAuth endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export function useGoogleAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Generate redirect URI
  // const redirectUri = AuthSession.makeRedirectUri({
  //   scheme: 'myapp'
  // });
  
  const redirectUri = "https://auth.expo.io/@nguyentuan/myapp";

  // Log redirectUri for debugging
  console.log('Generated redirectUri:', redirectUri);

  // Configure the auth request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '650345872241-1n6chu3kniehpol4kkv3k86o0d8mj4r6.apps.googleusercontent.com', // Replace with Web Client ID from Google Cloud Console
      scopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar'],
      redirectUri,
      responseType: 'code',
      extraParams: {
        access_type: 'offline',
        prompt: 'consent',
        hd: 'hcmut.edu.vn',
      },
    },
    discovery
  );

  // Sign-in function
  const signIn = async () => {
    if (!request) {
      setError(new Error('Auth request not ready'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        throw new Error(`Login failed: ${result.type}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error during sign-in'));
      setLoading(false);
    }
  };

  // Handle the response and exchange code for tokens
  useEffect(() => {
    const handleAuthCode = async () => {
      if (response?.type !== 'success') return;
      const { code } = response.params;

      try {
        // Log redirectUri sent to backend
        console.log('Sending redirectUri to backend:', redirectUri);

        // Exchange code for tokens via backend
        const backendResponse = await api.post('/auth/google/mobile', {
          code,
          code_verifier: request?.codeVerifier,
          redirect_uri: redirectUri,
        });

        const { access_token, refresh_token, user: userData } = backendResponse.data;

        // Store tokens and set auth header
        await tokenManager.setTokens(access_token, refresh_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Token exchange failed'));
        console.error('Token exchange error:', err);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCode();
  }, [response, request, redirectUri]);

  return { signIn, loading, error, user };
}