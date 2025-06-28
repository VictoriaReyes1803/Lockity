// services/usersService.ts
import type { Users } from "../models/User";
import {getApi} from "./interceptor";
const api = getApi("nest");


export const getUsersWithLockers = async (
  organizationId: string,
  page = 1,
  limit = 10,
  role?: string
): Promise<Users[]> => {
  const response = await api.get("/api/user-list/" + organizationId, {
    params: { page, limit, ...(role ? { role } : {}) },
  });
  return response.data.data.items as Users[];
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