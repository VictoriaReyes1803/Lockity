
import type { LockerListResponse , ListCompartmentsResponse, OrganizationResponse} from "../models/locker";
import {getApi} from "./interceptor";
const api = getApi("nest");
const pre = 'api/';

export const getLockers = async (
  page: number,
  limit: number,
  organization_id: string
): Promise<LockerListResponse> => {
  try {
    const response = await api.get(`${pre}lockers`, {
      params: {
        page,
        limit,
        organization_id,
      },
    });
    console.log("Locker response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error contacting backend, using mock data:", error);

    const mockResponse: LockerListResponse = {
      success: true,
      message: "Lockers retrieved successfully",
      data: {
        items: [
          {
            id: 10,
            organization_id: 1,
            area_id: 1,
            locker_number: 1999990,
            organization_name: "Lockity",
            area_name: "Oficina Central",
          },
          {
            id: 10,
            organization_id: 1,
            area_id: 1,
            locker_number: 10999,
            organization_name: "Lockity",
            area_name: "Oficina Central",
          },
        ],
        total: 15,
        page: 1,
        limit: 10,
        has_next_page: true,
        has_previous_page: true,
      },
    };

    return mockResponse;
  }
};


export const getCompartments = async (
  lockerId: number
): Promise<ListCompartmentsResponse> => {
  try {
    const response = await api.get(`${pre}lockers/${lockerId}/compartments`);
    console.log("Compartments response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error connecting to backend, using mock compartments:", error);

    const mockResponse: ListCompartmentsResponse = {
      success: true,
      message: "Compartments retrieved successfully",
      data: {
        items: [
          {
            id: 10,
            compartment_number: 2,
            status: "open",
            users: [
              {
                id: 5,
                name: "Jesus Arturo",
                last_name: "Hernandez",
                second_last_name: "Cristan",
                email: "arturitoCanicas@gmail.com",
                role: "admin",
              },
              {
                id: 10,
                name: "Marco Antonio",
                last_name: "Chavez",
                second_last_name: "Baltierrez",
                email: "marco@gmail.com",
                role: "user",
              },
            ],
          },
          {
            id: 11,
            compartment_number: 3,
            status: "closed",
            users: [
              {
                id: 5,
                name: "Jesus Arturo",
                last_name: "Hernandez",
                second_last_name: "Cristan",
                email: "arturitoCanicas@gmail.com",
                role: "user",
              },
              {
                id: 10,
                name: "Marco Antonio",
                last_name: "Chavez",
                second_last_name: "Baltierrez",
                email: "marco@gmail.com",
                role: "admin",
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

    return mockResponse;
  }
};


export const getOrganization = async (): Promise<OrganizationResponse> => {
    const response = await api.get(`${pre}organizations`);

    return response.data as OrganizationResponse;
    }

    export const postOrganization = async (payload: {
        name: string;
        description: string;
        area : {
            name: string;
            description: string;
        };
        locker_serial_number: string;
    }): Promise<void> => {
        await api.post(`${pre}organizations`, payload);
    }
    