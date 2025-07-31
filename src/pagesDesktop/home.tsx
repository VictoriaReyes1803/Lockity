import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setEncryptedCookie } from '../lib/secureCookies';
import { generateCodeVerifier, generateCodeChallenge } from '../utils/pkce';

const url = import.meta.env.VITE_BACKEND_URL;

import NavbarHome from "../components/NavbarHome";


export default function HomeDesktop() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.navigator.userAgent.includes("Electron")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);
const handle = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = crypto.randomUUID();

  setEncryptedCookie('pkce_code_verifier', codeVerifier);
  setEncryptedCookie('oauth_state', state);

  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;

  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: '',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    device: 'desktop',
  });

  window.location.href = `${url}oauth/authorize?${queryParams.toString()}`;
};

  return (
    <div className="bg-[#2E2D2D] text-white min-h-screen w-full">
        <NavbarHome/> 
    
     <section className="flex flex-col-reverse md:flex-row items-center justify-between md:px-20 py-[7rem] px-6">
 
  <div className="mt-12 md:mt-0 text-center md:text-left">
    <h1 className="text-4xl md:text-6xl  font-bold mb-6">
      YOUR SMART LOCKER SECURED.
    </h1>
    <p className="text-lg md:text-2xl text-gray-400 mb-8">
      Advanced biometric technology to keep your belongings safe. Anytime. Anywhere.
    </p>
    <div className="space-x-4">
      <button className="bg-[#FFD166] text-black px-6 py-2  font-semibold hover:bg-[#e2ba5d] transition"
      onClick={handle}>
        Get Started
      </button>
      
    </div>
  </div>
  <div className="mb-12 md:mb-0">
    <img
      src="/images/logosin.svg"
      alt="Fingerprint Icon"
      className="w-[14rem] md:w-[19rem] h-auto mx-auto opacity-80"
    />
  </div>
  </section>
  
  </div>
  );
  }