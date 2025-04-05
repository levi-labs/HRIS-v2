import { z } from 'zod';

export const departmentOfficeSchema = z.object({
    departmentId: z.number(),
    officeId: z.number(),
    startDate: z.string(),
    endDate: z.string().nullable().optional(),
});
