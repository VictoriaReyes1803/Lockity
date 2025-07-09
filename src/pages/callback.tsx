import { useEffect, useState} from 'react';
import Loader from "../components/Loader";


const Callback = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = localStorage.getItem('oauth_state');
      const codeVerifier = localStorage.getItem('pkce_code_verifier');

      console.log('state in URL:', state);
      console.log('storedState:', storedState);
      if (state !== storedState) {
        alert('CSRF detected: state mismatch.');
        setLoading(false);
        return;
      }

      if (!code || !codeVerifier) {
        alert('Missing code or verifier');
        setLoading(false);
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
          localStorage.removeItem('oauth_state');

          window.location.href = '/me'; 
        } else {
          setLoading(false);

        }
      } catch (err) {
        console.error('Failed to exchange token:', err);
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {loading ? (
        <Loader />
      ) : (
        
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Complete</h1>

        </div>
      )}
    </div>
  );
};

export default Callback;
