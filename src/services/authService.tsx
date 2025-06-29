import type { User } from "../models/User";
import {getApi} from "./interceptor";
const api = getApi("laravel");
const pre = 'api/users/';

export const Me = async (): Promise<User> => {
  

  const response = await api.get(`${pre}me`);
  return response.data.data as User;

};

export const haslocker = async (): Promise<boolean> => {
  const response = await api.get(`${pre}has-lockers`);
  return response.data.data as boolean;
}

export const UpdateUser = async (user: User): Promise<User> => {
  const response = await api.put(`${pre}me`, user);
  return response.data.data as User;
};

export const Logout = async (): Promise<void> => {

  const response = await api.post(`${pre}auth/logout`);
  localStorage.removeItem("access_token");
  console.log("Logout response:", response.data);

}