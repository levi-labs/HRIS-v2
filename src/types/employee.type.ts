import { UserRequest } from "./user.type.js";

export type EmployeeResponse = {
    id: number;
    first_name: string;
    last_name: string;
    userId : number;
    job_position_id: number;
}

export type EmployeeRequest = UserRequest & {
    first_name: string;
    last_name: string;
    job_position_id: number;
}