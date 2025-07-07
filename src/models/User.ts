export interface User {
  id: number;
  name: string;
  last_name: string;
  second_last_name: string;
  email: string;
  role?: string;
}
export interface userlist{
  message: string;
  success: boolean;
  data: User;
}

export interface Users {
  name: string;
  last_name: string;
  second_last_name: string;
  email: string;
  assigned_lockers: {
    serial_number: string;
    role: string;
    organization: string;
    area: string;
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