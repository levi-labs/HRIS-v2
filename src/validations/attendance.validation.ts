import {z} from "zod";

export const attendanceSchema = z.object({
    employeeId: z.number(),
    latitude: z.string(),
    longitude: z.string(),
});