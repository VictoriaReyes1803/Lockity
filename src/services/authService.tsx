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

export const Logout = async (): Promise<void> => {

  const response = await api.post(`${pre}auth/logout`);
  localStorage.removeItem("access_token");
  sessionStorage.clear();
  console.log("Logout response:", response.data);

}