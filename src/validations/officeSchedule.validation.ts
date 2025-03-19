
import {z} from "zod";


export const officeScheduleSchema = z.object({
    office_id: z.number(),
    day: z.enum(['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU']),
    work_start: z.string(),
    work_end: z.string(),
    break_start: z.string().nullable().optional(),
    break_end: z.string().nullable().optional(),
    // late_tolerance: z.number(),
    // early_tolerance: z.number(),
});

// export type OfficeScheduleRequest = z.infer<typeof officeScheduleSchema>;