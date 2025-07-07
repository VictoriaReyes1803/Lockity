import type {User} from "./User";
export interface Locker {
  id: number;
  organization_id: number;
    area_id: number;
    locker_number: number;
    organization_name: string;
    area_name: string;
}
export interface LockerListResponse {
  data:
  {
   items: Locker[];
  total: number;
  page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  limit: number;
  }
  message: string;
  success: boolean;

}
export interface Compartment {
id : number;
status: string;
compartment_number: number;
users : User[];
}
export interface ListCompartmentsResponse {
    data: {
        items: Compartment[];
        total: number;
        page: number;
        limit: number;
        has_next_page: boolean;
        has_previous_page: boolean;
    }
    message: string;
    success: boolean;

}
export interface organization {
    id : number;
    name: string;
    description: string;
    areas: {
        id: number;
        name: string;
        description: string;
    }

}
export interface OrganizationResponse {
    
    data:{
    items: organization[];
    total: number;
    page: number;
    limit: number;
    }
    message: string;
    success: boolean;
}