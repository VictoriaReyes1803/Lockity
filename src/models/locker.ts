import type {User} from "./User";
export interface Schedule {
day_of_week: string | null;
start_time: string;
end_time: string;
repeat_schedule: boolean;
schedule_date: string | null;
schedule_id: number;
}
export interface Locker {
  locker_id: number;
  organization_id: number;
    area_id: number;
    locker_number: number;
    locker_serial_number: string;
    organization_name: string;
    area_name: string;
    schedules?: Schedule[];
    compartments?: Compartment[];
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
  compartment_id: number;
  status: string;
  compartment_number: number;
  users: User[];
  id: number;
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

export interface Contactanos{
  name: string;
  email: string;
  message: string;
  captchaToken: string | null;
 
}