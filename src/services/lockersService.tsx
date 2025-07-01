
import type { LockerListResponse , ListCompartmentsResponse, OrganizationResponse} from "../models/locker";
import {getApi} from "./interceptor";
const api = getApi("nest");
const pre = 'api/';

export const getLockers = async (page: number, limit: number, organization_id: string): Promise<LockerListResponse> => {
  const response = await api.get(`${pre}lockers`, {
    params: {
      page: page,
      limit: limit,
      organization_id: organization_id,
    }
  });
 console.log("Locker response:", response.data);
  return response.data ;
}

export const getCompartments = async (lockerId: number): Promise<ListCompartmentsResponse> => {
    const response = await api.get(`${pre}lockers/${lockerId}/compartments`);
   
    return response.data.data as ListCompartmentsResponse;
    }

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
    