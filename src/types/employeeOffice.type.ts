import { EmployeeOffice } from "@prisma/client";

export type EmployeeOfficeRequest = {
    employeeId: number,
    officeId: number,
    endDate?: Date | null
};