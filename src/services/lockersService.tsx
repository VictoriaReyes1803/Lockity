
// src/services/lockersService.ts
import type { LockerListResponse , ListCompartmentsResponse} from "../models/locker";
//import type { OrganizationResponse } from "../models/organization";
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



  export const putlocker = async (
    payload: {
   organization_id: number;
   area_id: number;
   serial_number: string;
   new_schedule?:
   {
    day_of_week: number | null;
    start_time: string;
    end_time: string;
    repeat_schedule: boolean;
    schedule_date: string | null;
   }[];

    }

    
  ): Promise<void> => {
    const response = await api.put(`${pre}lockers`, payload);
    console.log('cuerpo',payload)
    console.log("Put locker response:", response.data);
    return response.data;
  }

  export const deleteRole = async (
    lockerId: number,
    userId: number,

    
      compartmentNumber: number,
      deleteAllAccess: boolean
    
  ): Promise<void> => {
    const response = await api.delete(
      `${pre}lockers/${lockerId}/${userId}`,
      {
        params: {
          compartmentNumber,
          deleteAllAccess,
        },
      }
    );
    console.log("Delete role response:", response.data);
    return response.data;
  }

  export const putSchedule = async (
    lockerId: number,
    scheduleId: number,
    payload: {
      day_of_week: string | null;
      start_time: string;
      end_time: string;
      repeat_schedule: boolean;
      schedule_date: string | null;
    }
  ): Promise<void> => {
    console.log('cuerpo del put',payload)
    const response = await api.put(`${pre}lockers/${lockerId}/schedules/${scheduleId}`,
      payload
    );
    return response.data;
  }

  export const deleteSchedule = async (
    lockerId: number,
    scheduleId: number,
    deleteAllSchedules: boolean,
  ): Promise<void> => {
    const response = await api.delete(
      `${pre}lockers/${lockerId}/schedules/delete`,
      {
        data: {
          scheduleId,
          deleteAllSchedules,
        },
      }
    );
    console.log("Delete schedule response:", response.data);
    return response.data;
  }
