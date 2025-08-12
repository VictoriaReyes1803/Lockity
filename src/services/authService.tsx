
import type { User, userlist} from "../models/User";
import {getApi} from "./interceptor";
import { getEncryptedCookie } from '../lib/secureCookies';
import Cookies from "js-cookie";
const api = getApi("laravel");
const pre = 'api/users/';

export const Me = async (): Promise<userlist> => {
  

  const response = await api.get(`${pre}me`);
  return response.data ;

};

export const haslocker = async (): Promise<boolean> => {
  const response = await api.get(`${pre}has-lockers`);
  return response.data.data.has_lockers as boolean;
}

export const UpdateUser = async (user: User): Promise<userlist> => {
  const response = await api.put(`${pre}me`, user);
  console.log("UpdateUser response:", response.data);
  return response.data;
};

export const Logout = async (): Promise<{ apiResponse: any; webLogoutResponse: any }> => {
  try {
    const apiResponse = await api.post(`${pre}auth/logout`);
    console.log("Logout response:", apiResponse.data);

    Cookies.remove("access_token");
    Cookies.remove("oauth_state");
    Cookies.remove("pkce_code_verifier");
    Cookies.remove("u_7f2a1e3c");
    Cookies.remove("s_12be90dd");
    Cookies.remove("o_ae3d8f2b")
    Cookies.remove("selected_locker");
    

    const webLogoutResponseRaw = await fetch(`${import.meta.env.VITE_BACKEND_URL}web-logout`, {
      method: 'POST',
      credentials: 'include',
    });
    const webLogoutResponse = await webLogoutResponseRaw.json();
    console.log("Web logout response:", webLogoutResponse);
    console.log("api response ",apiResponse.data);
    return { apiResponse: apiResponse.data, webLogoutResponse };
    // return apiResponse.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

