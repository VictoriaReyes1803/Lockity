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
    const response = await api.get("/api/lockers/user-list/" + organizationId, {
      params: { page, limit, ...(role ? { role } : {}) },
    });
    return response.data.data as UserListResponse;
  
};


export const putUserRole = async (
 lockerId: string | number,
  compartmentNumber:  number,
  payload: {
    user_email: string;
    role: string;
  }
): Promise<void> => {
  console.log('cuerpo del put',payload)
  await api.put(
    `/api/lockers/${lockerId}/${compartmentNumber}/users`,
    payload
  );
};