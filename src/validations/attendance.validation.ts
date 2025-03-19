import {z} from "zod";

export const attendanceSchema = z.object({
    employeeId: z.number(),
    date: z.string(),
    latitude: z.string(),
    longitude: z.string(),
});