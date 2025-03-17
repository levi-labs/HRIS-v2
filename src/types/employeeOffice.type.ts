import { EmployeeOffice } from "@prisma/client";

export type EmployeeOfficeRequest = {
    employeeId: number,
    officeId: number,
    startDate: Date,
    endDate?: Date | null
};