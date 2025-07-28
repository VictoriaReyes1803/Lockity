export function generateCodeVerifier(length = 127): string {
   if (typeof window === 'undefined' || !window.crypto?.getRandomValues) {
    throw new Error('Web Crypto API not available for getRandomValues.');
  }
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  values.forEach(v => result += charset[v % charset.length]);
  console.log('Generated code verifier:', result); 
  return result;
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
   if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('Web Crypto API not available in this environment.');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(digest));
  const base64 = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64;
}
