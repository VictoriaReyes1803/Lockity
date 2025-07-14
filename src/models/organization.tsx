
export interface organization {
    id : number;
    name: string;
    description: string;
    areas: Area[];

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
export interface locker{
    id: number;
    serial_number: string;
}
export interface Area {
    id: number;
    name: string;
    description: string;
    lockers: locker[];
}