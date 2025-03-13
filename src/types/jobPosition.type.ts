export type JobPositionRequest = {
    name: string;
    level: string;
    salary_min: number;
    salary_max: number;
    department_id: number;
}

export type JobPositionResponse = {
    id: number;
    name: string;
    level: string;
    salary_min: string;
    salary_max: string;
    department_id?: string;
}