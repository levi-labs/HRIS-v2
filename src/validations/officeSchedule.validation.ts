import e from "express";
import {z} from "zod";


export const officeScheduleSchema = z.object({
    office_id: z.number(),
    day: z.string().min(3,"Day must be at least 3 characters long"),
    work_start: z.string(),
    work_end: z.string(),
    break_start: z.string(),
    break_end: z.string(),
    late_tolerance: z.number(),
    early_tolerance: z.number(),
});

export type OfficeScheduleRequest = z.infer<typeof officeScheduleSchema>;