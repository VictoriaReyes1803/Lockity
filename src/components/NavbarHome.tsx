// import { useLocation } from 'react-router-dom';
import { generateCodeVerifier, generateCodeChallenge } from '../utils/pkce';
import { setEncryptedCookie } from '../lib/secureCookies';
const url = import.meta.env.VITE_BACKEND_URL;

const isElectron = () => window.navigator.userAgent.includes("Electron");

const handle = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = crypto.randomUUID();
  setEncryptedCookie('oauth_state', state);

  setEncryptedCookie('pkce_code_verifier', codeVerifier);
  setEncryptedCookie('oauth_state', state);

  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
console.log('url', url);
  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: '',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    device: isElectron() ? 'desktop' : 'web',

  });

  window.location.href = `${url}oauth/authorize?${queryParams.toString()}`;
};


function NavbarHome() {
  // const location = useLocation();
//   const currentPath = location.pathname;

// interface IsActiveFn {
//     (path: string): string;
//}



// const isActive: IsActiveFn = (path: string): string =>
//     currentPath === path
//         ? 'underline hover:decoration-[#A3A8AF] hover:text-[#A3A8AF] underline-offset-8 decoration-[#A3A8AF] decoration-2'
//         : 'hover:underline hover:decoration-[#A3A8AF] hover:text-[#A3A8AF]';

  return (
    <nav className="sticky top-0 z-50 bg-[#2E2D2D] flex justify-between items-center px-8 py-2">
 
      <div className="flex items-center space-x-2">
        <img src="/images/logo.svg" alt="LOCKITY logo" className="w-14 h-14" />
      </div>

      {!isElectron() && (
          <div className="flex-1 flex justify-center items-center space-x-10 text-sm font-semibold">

            <button
              onClick={handle}
              className="space-x-10 text-sm font-semibold hover:underline underline-offset-4 transition"
            >
              Access
            </button>
          </div>
        )}


   
    </nav>
  );
}

export default NavbarHome;
