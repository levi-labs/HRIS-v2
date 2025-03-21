import {z} from "zod";

export const transferRequestForEmployeeSchema = z.object({
    employeeId: z.number(),
    fromOffice: z.number(),
    toOffice: z.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});