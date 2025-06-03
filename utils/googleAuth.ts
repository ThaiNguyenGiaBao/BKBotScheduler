import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import api, { tokenManager } from '@/api';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export function useGoogleAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '650345872241-1n6chu3kniehpol4kkv3k86o0d8mj4r6.apps.googleusercontent.com',
      scopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar'],
      redirectUri: AuthSession.makeRedirectUri({
        useProxy: true,
      }),
      responseType: 'code',
      extraParams: {
        access_type: 'offline',
        prompt: 'consent',
        hd: 'hcmut.edu.vn',
      },
    },
    discovery
  );

  const signIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await promptAsync();
      if (res.type !== 'success') throw new Error('Login cancelled or failed');
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleAuthCode = async () => {
      if (response?.type !== 'success') return;
      const { code } = response.params;

      try {
        const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

        // Send to your backend for token exchange
        const backendResponse = await api.post('/auth/google/mobile', {
          code,
          code_verifier: request?.codeVerifier,
          redirect_uri: redirectUri,
        });

        const { access_token, refresh_token, user: userData } = backendResponse.data;

        await tokenManager.setTokens(access_token, refresh_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser(userData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCode();
  }, [response]);

  return { signIn, loading, error, user };
}
