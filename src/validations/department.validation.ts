import {z} from "zod";

export const departmentSchema = z.object({
    name: z.string().min(2,"Name must be at least 2 characters long"),
    phone: z.string().min(8,"Phone must be at least 8 characters long"),
});