import { OfficeScheduleDays } from "@prisma/client";

export type OfficeScheduleRequest = {
    office_id: number;
    day: OfficeScheduleDays;
    work_start: string;
    work_end: string;
    break_start?: string | null;
    break_end?: string | null;
    late_tolerance?: number ;
    early_tolerance?: number;
};