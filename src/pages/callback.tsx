import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = sessionStorage.getItem('oauth_state');
      const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

      if (state !== storedState) {
        alert('CSRF detected: state mismatch.');
        return;
      }

      if (!code || !codeVerifier) {
        alert('Missing code or verifier');
        return;
      }

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: import.meta.env.VITE_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        code,
        code_verifier: codeVerifier,
      });
console.log('Exchanging code for token with body:', body.toString());
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        });

        const data = await response.json();

        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          console.log('Token received:', data.access_token);
          window.location.href = '/me'; 
        } else {
          console.error('Token error:', data);
        }
      } catch (err) {
        console.error('Failed to exchange token:', err);
      }
    };

    fetchToken();
  }, []);

   <p className="text-center">Validating code...</p>;
};

export default Callback;
