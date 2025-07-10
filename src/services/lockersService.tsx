
// src/services/lockersService.ts
import type { LockerListResponse , ListCompartmentsResponse, OrganizationResponse} from "../models/locker";
import {getApi} from "./interceptor";
const api = getApi("nest");
const pre = 'api/';

export const getLockers = async (
  page: number,
  limit: number,
  organization_id: string,
  showSchedules?: boolean
): Promise<LockerListResponse> => {
    const params: any = {
      page,
      limit,
      organization_id,
    };
    if (showSchedules) {
      params.showSchedules = true;
    }
    const response = await api.get(`${pre}lockers`, { params });
    console.log("Locker response:", response.data);
    return response.data;
};


export const getCompartments = async (
  lockerId: number
): Promise<ListCompartmentsResponse> => {
    const response = await api.get(`${pre}lockers/${lockerId}/compartments`);
    console.log("Compartments response:", response.data);
    return response.data;
  
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
    
   


  export const putlocker = async (
    payload: {
   organization_id: number;
   area_id: number;
   serial_number: string;
   new_schendule?:
   {
    day_of_week: number;
    start_time: string;
    end_time: string;
    repeat_schedule: boolean;
    schendule_date: string;
   }[];

    }
  ): Promise<void> => {
    const response = await api.put(`${pre}lockers`, payload);
    console.log(payload)
    return response.data;
  }

  export const deleteRole = async (
    lockerId: number,
    compartmentNumber: number,
    userId: number
  ): Promise<void> => {
    const response = await api.delete(
      `${pre}lockers/${lockerId}/${compartmentNumber}/users/${userId}`
    );
    console.log("Delete role response:", response.data);
    return response.data;
  }