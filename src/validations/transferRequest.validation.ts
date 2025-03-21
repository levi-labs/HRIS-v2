import {z} from "zod";

export const transferRequestForEmployeeSchema = z.object({
    employeeId: z.number(),
    fromOffice: z.number(),
    toOffice: z.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const transferRequestForHRDSchema = z.object({
    employeeId: z.number(),
    fromOffice: z.number(),
    toOffice: z.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    approvedBy: z.number(),
});