import {z} from "zod";

export const employeeScheduleSchema = z.object({
    employeeId: z.number(),
    scheduleDate: z.string(),
    workType: z.enum(["SHIFT_CHANGE", "WFH"]),
});

export type EmployeeScheduleRequest = z.infer<typeof employeeScheduleSchema>;