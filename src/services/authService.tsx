import type { User } from "../models/User";
import api from "./interceptor";

export const Me = async (): Promise<User> => {

  const response = await api.get("/api/users/me");
  console.log("User info response:", response.data.data);
  return response.data.data as User;

};

export const UpdateUser = async (user: User): Promise<User> => {
console.log("Updating user with data:", user);
  const response = await api.put("/api/users/me", user);
  console.log("Updated user response:", response);
  return response.data.data as User;
};

export const Logout = async (): Promise<void> => {

  await api.post("/api/auth/logout");
  localStorage.removeItem("access_token");
  console.log("User logged out successfully");

}