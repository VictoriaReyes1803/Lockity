import Cookies from "js-cookie";
import type { User, userlist} from "../models/User";
import {getApi} from "./interceptor";
const api = getApi("laravel");
const pre = 'api/users/';

export const Me = async (): Promise<userlist> => {
  

  const response = await api.get(`${pre}me`);
  return response.data ;

};

export const haslocker = async (): Promise<boolean> => {
  const response = await api.get(`${pre}has-lockers`);
  return response.data.data as boolean;
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

    localStorage.removeItem("access_token");
    sessionStorage.clear();

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
