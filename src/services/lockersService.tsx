
// src/services/lockersService.ts
import type { act } from "react";
import type { LockerListResponse , ListCompartmentsResponse} from "../models/locker";
//import type { OrganizationResponse } from "../models/organization";
import {getApi} from "./interceptor";
import type { Contactanos } from "../models/locker";

const api = getApi("nest");
const pre = 'api/';
const isElectron = (): boolean => {
  return typeof navigator === "object" && navigator.userAgent.toLowerCase().includes("electron");
};

export const getLockers = async (
  page: number,
  limit: number,
  organizationId: string,
  showSchedules?: boolean
): Promise<LockerListResponse> => {
    const params: any = {
      page,
      limit,
      organizationId,
    };
    if (showSchedules) {
      params.showSchedules = true;
    }
     const route = isElectron()
  ? `${pre}lockers/admin`        
  : `${pre}lockers/super_admin`; 

    const response = await api.get(route, { params });
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
export const getlockersforArea = async (areaId: number): Promise<any> => {
    const route = isElectron()
  ? `${pre}lockers/${areaId}/admin`        
  : `${pre}lockers/${areaId}/super_admin`; 

    const response = await api.get(route);
    console.log(areaId)
    return response.data;
}


export const statusLocker = async (
  serialNumber: string,
  compartmentNumber: number,
  status: boolean
): Promise<void> => {
  const response = await api.get(`${pre}locker/${serialNumber}/${compartmentNumber}/${status}`, );
  return response.data;
}


export const contactanos = async (dataContactanos: Contactanos): Promise<any> => {
  const response = await api.post(`${pre}contact`, dataContactanos);
  console.log("Contactanos response:", response.data);
  return response.data;
}
