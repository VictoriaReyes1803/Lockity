
export interface logsresponse {
    success: boolean;
    message: string;
    data: 
    {
        items: Log[];
        total: number;
        page: number;
        limit: number;
        has_next_page: boolean;
        has_previous_page: boolean;
    };
}
export interface Log {
    id: number;
    locker : locker;
    action: string;
    performed_by: performed_by;
    source: string;
    photo_path: string;
    timestamp: string;
}
export interface locker{
    serial_number: string;
    number_in_the_area: number;
    manipulated_compartment: number;
    organization_name: string;
    area_name: string;

}
export interface performed_by
{
    full_name: string;
    email: string;
    role: string;
}

export interface LogResponse {
    success: boolean;
    message: string;
    data:  {
        items: AuditLog[];
        total: number;
        page: number;
        limit: number;
        has_next_page: boolean;
        has_previous_page: boolean;
    };

}
export interface AuditLog {
    id : number;
    description: string;
    locker: locker;
    performed_by: performed_by;
    timestamp: string;
    target_user: performed_by;
}