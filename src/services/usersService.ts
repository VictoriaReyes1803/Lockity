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
  try {
    const response = await api.get("/api/lockers/user-list/" + organizationId, {
      params: { page, limit, ...(role ? { role } : {}) },
    });
    console.log("Real response:", response.data);
    return response.data.data as UserListResponse;
  } catch (err) {
    console.error("Error fetching users, using mock data:", err);

    const mockResponse = {
      success: true,
      message: "Users with role admin retrieved successfully",
      data: {
        items: [
          {
            id: 10,
            name: "Juan",
            last_name: "Pérez",
            second_last_name: "García",
            email: "juan.perez@example.com",
            assigned_lockers: [
              {
                serial_number: "SS3-54N-MN",
                role: "admin",
                organization: "UTT",
                area: "La milla verde",
                locker_number_in_area: 3,
              },
              {
                serial_number: "AS3-55N-BA",
                role: "user",
                organization: "UTT",
                area: "La milla roja",
                locker_number_in_area: 4,
              },
            ],
          },
          {
            id: 12,
            name: "María",
            last_name: "López",
            second_last_name: "Sánchez",
            email: "maria.lopez@example.com",
            assigned_lockers: [
              {
                serial_number: "SS3-54N-MN",
                role: "user",
                organization: "UTT",
                area: "La milla verde",
                locker_number_in_area: 3,
              },
              {
                serial_number: "AS3-55N-BA",
                role: "admin",
                organization: "UTT",
                area: "La milla roja",
                locker_number_in_area: 4,
              },
            ],
          },
        ],
        total: 15,
        page: 1,
        limit: 10,
        has_next_page: true,
        has_previous_page: true,
      },
    };

    return {
      items: mockResponse.data.items,
      total: mockResponse.data.total,
      page: mockResponse.data.page,
      limit: mockResponse.data.limit,
      message: mockResponse.message,
    } as UserListResponse;
  }
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