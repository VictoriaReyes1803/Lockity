import type {  OrganizationResponse} from "../models/organization";
import {getApi} from "./interceptor";
const api = getApi("nest");
const pre = 'api/';



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
        return;
    }
    
export const putOrganization = async (payload: {
    name: string;
    description: string;
}, organizationId: number)
: Promise<any> => {
    const response = await api.put(`${pre}organizations/${organizationId}`, payload);
    return response;
}

export const getAreas = async (organizationId: string): Promise<any> => {
    const response = await api.get(`${pre}organizations/${organizationId}/areas`);
    return response.data;
}

export const putArea = async (payload: {
    name: string;
    description: string;
}, areaId: number): Promise<any> => {
    const response = await api.put(`${pre}organizations/${areaId}/areas/`, payload);
    return response;
}

export const postArea = async ( organization_id: number,payload: {
    name: string;
    description: string;
   
}): Promise<any> => {
    const response = await api.post(`${pre}organizations/${organization_id}/areas`, payload);
    return response;
}