import {z} from "zod";
export const employeeSchema = z.object({
    first_name: z.string().min(2,"First name must be at least 2 characters long"),
    last_name: z.string().min(2,"Last name must be at least 2 characters long"),
    job_position_id: z.number(),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email(),
    roleId: z.number(),
});