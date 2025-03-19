import {z} from "zod";
const today = new Date();
today.setHours(0, 0, 0, 0);

export const employeeOfficeSchema = z.object({
    employeeId: z.number(),
    officeId: z.number(),
});