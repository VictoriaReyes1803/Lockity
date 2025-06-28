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

 console.log("response:", response);
  return response.data.data.items as Users[];
};
