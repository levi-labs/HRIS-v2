import {z} from "zod";


export const jobPositionSchema = z.object({
    name: z.string().min(3,"Name must be at least 3 characters long"),
    level: z.enum([
        "INTERN",   
        "ENTRY_LEVEL",
        "JUNIOR",
        "MID_LEVEL",
        "SENIOR",
        "LEAD",
        "SUPERVISOR",
        "MANAGER",
        "SENIOR_MANAGER",
        "DIRECTOR",
        "VICE_PRESIDENT",
        "C_LEVEL",
        "FOUNDER",
    ],{
        message: "Invalid job level. Please choose a valid option.",
    }),
    salary_min: z.number().min(0,"Salary must be a positive number"),
    salary_max: z.number().min(0,"Salary must be a positive number"),
    department_id: z.number(),
}).refine((data) => data.salary_max >= data.salary_min, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salary_max"],
}).refine((data) => !(data.salary_max > 10_000_000 && data.salary_min > 10_000_000 && !["FOUNDER", "C_LEVEL"].includes(data.level)), {
    message: "Maximum salary cannot be greater than 10,000,000 if level is not FOUNDER or C_LEVEL",
    path: ["salary_max"],
});