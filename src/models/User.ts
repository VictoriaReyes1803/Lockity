export interface Role {
  area_name: string;
  organization_name: string;
  locker_serial_number: string;
  role: string;
  compartment_number?: number;
}

export interface User {
  id: number;
  name: string;
  last_name: string;
  second_last_name: string;
  email: string;
  roles?: Role[];
}

export interface userlist{
  message: string;
  success: boolean;
  data: User;
}
export interface compartments{
  compartment_id:number;
  compartment_number: number;
}

export interface Users {
  id: number;
  name: string;
  last_name: string;
  second_last_name: string;
  email: string;
  assigned_lockers: {
    serial_number: string;
    role: string;
    organization: string;
    area: string;

    compartments: compartments[];
    locker_id: number;
    locker_number_in_area: number;
  }[];
}
export interface UserListResponse {
  items: Users[];
  total: number;
  page: number;
  limit: number;
  message: string;
  
}

export interface Userlocker{
email: string;
role: string;
locker_id: number;
compartment_number: number;

}