// lib/secureCookies.ts
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET = import.meta.env.VITE_COOKIE_SECRET || 'default-secret'; 

export const setEncryptedCookie = (key: string, value: unknown, maxAgeSeconds = 604800) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET).toString();
  Cookies.set(key, encrypted, { expires: maxAgeSeconds / 86400 }); 
};

export const getEncryptedCookie = (key: string) => {
  const encrypted = Cookies.get(key);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('Failed to decrypt cookie', err);
    return null;
  }
};
