import type { User } from "../models/User";
import {getApi} from "./interceptor";
const api = getApi("laravel");
const pre = 'api/users/';

export const Me = async (): Promise<User> => {
  

  const response = await api.get(`${pre}me`);
  console.log("User info response:", response.data.data);
  return response.data.data as User;

};

export const UpdateUser = async (user: User): Promise<User> => {
  const response = await api.put(`${pre}me`, user);
  return response.data.data as User;
};

export const Logout = async (): Promise<void> => {

  const response = await api.post(`${pre}auth/logout`);
  localStorage.removeItem("access_token");
  console.log("Logout response:", response.data);

}