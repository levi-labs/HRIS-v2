export type DepartmentResponse = {
    id: number;
    name: string;
    phone: string;
    address: string;
}

export type DepartmentRequest = {
    name: string;
    phone: string;
    address: string;
}