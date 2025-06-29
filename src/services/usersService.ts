// services/usersService.ts
import type { UserListResponse } from "../models/User";
import {getApi} from "./interceptor";
const api = getApi("nest");


export const getUsersWithLockers = async (
  organizationId: string,
  page = 1,
  limit = 10,
  role?: string
): Promise<UserListResponse> => {
  const response = await api.get("/api/user-list/" + organizationId, {
    params: { page, limit, ...(role ? { role } : {}) },
  });
  console.log(response)
  return response.data.data as UserListResponse;
};

export const putUserRole = async (
 lockerId: string | number,
  compartmentNumber: string | number,
  payload: {
    user_email: string;
    role: string;
  }
): Promise<void> => {
  await api.put(
    `/api/lockers/${lockerId}/${compartmentNumber}/users`,
    payload
  );
};