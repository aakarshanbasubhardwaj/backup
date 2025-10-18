import { useState } from 'react';

export function useLogin() {
  const [response, setResponse] = useState<null | unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const sendLoginRequest = async () => {
    try {
      const backendUrl = import.meta.env.VITE_APP_ENV;
      if (!backendUrl) {
        throw new Error('VITE_APP_ENV is not defined');
      }

      const redirectUri = window.location.origin;
      const authUrl = `${backendUrl}/auth/google?redirect=${encodeURIComponent(
        redirectUri
      )}`;

      // Redirect to  backend’s Google OAuth route
      window.location.href = authUrl;
    } catch (err) {
      console.error('Google login redirect failed:', err);
      setError('An error occurred while sending the request.');
      setResponse(null);
    }
  };

  return {
    response,
    error,
    sendLoginRequest,
  };
}
