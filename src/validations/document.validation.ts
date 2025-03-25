import {z} from "zod";


export const documentSchema = z.object({
    employeeId: z.number(),
    title: z.string().min(3,"Name must be at least 3 characters long"),
    filePath: z.string().min(3,"File path must be at least 3 characters long"),
    
});