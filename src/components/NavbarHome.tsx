// NavbarHome.tsx
import { useState, useCallback, useMemo } from "react";
import { generateCodeVerifier, generateCodeChallenge } from "../utils/pkce";
import { setEncryptedCookie } from "../lib/secureCookies";
import Loader from "./Loader";

const url = import.meta.env.VITE_BACKEND_URL;

function isElectron() {
  // Si algún día renderizas en SSR, protege el acceso a window:
  return typeof window !== "undefined" && window.navigator.userAgent.includes("Electron");
}

export default function NavbarHome() {
  const [loading, setLoading] = useState(false);

  const handle = useCallback(async () => {
    setLoading(true);
    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = crypto.randomUUID();

      setEncryptedCookie("pkce_code_verifier", codeVerifier);
      setEncryptedCookie("oauth_state", state);

      const clientId = import.meta.env.VITE_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_REDIRECT_URI;

      const queryParams = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: "",
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        device: isElectron() ? "desktop" : "web",
      });

      window.location.href = `${url}oauth/authorize?${queryParams.toString()}`;
    } catch (e) {
      console.error("Error en handle:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#2E2D2D] flex justify-between items-center px-8 py-2">
      {loading && <Loader />}
      <div className="flex items-center space-x-2">
        <img src="/images/logo.svg" alt="LOCKITY logo" className="w-14 h-14" />
      </div>

      {!isElectron() && (
        <div className="flex-1 flex justify-center items-center space-x-10 text-sm font-semibold">
          <button
            onClick={handle}
            aria-label="Access"
            disabled={loading}
            className={[
              "group relative inline-flex items-center gap-2 ",
              "px-5 py-2 text-sm font-semibold",
              "bg-gradient-to-r from-[#FFD166] to-[#FFD122] text-black",
              "shadow hover:brightness-90",
              "transition active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
              "hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed",
              "before:absolute before:inset-0 before:rounded-xl before:bg-white/25",
              "before:opacity-0 before:transition group-hover:before:opacity-10",
            ].join(" ")}
          >
            Access
          </button>
        </div>
      )}
    </nav>
  );
}

