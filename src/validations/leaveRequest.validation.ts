import {z} from "zod";


export const leaveRequestHrdSchema = z.object({
    employeeId: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    reason: z.string(),
    leaveType: z.enum(["ANNUAL", "SICK", "MATERNITY", "PATERNITY", "UNPAID", "PERSONAL", "BEREAVEMENT", "MARRIAGE", "STUDY", "RELIGIOUS"]),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const leaveRequestEmployeeSchema = z.object({
    user: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    reason: z.string(),
    leaveType: z.enum(["ANNUAL", "SICK", "MATERNITY", "PATERNITY", "UNPAID", "PERSONAL", "BEREAVEMENT", "MARRIAGE", "STUDY", "RELIGIOUS"]),
})