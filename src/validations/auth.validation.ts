import {z} from "zod";

export const userLoginSchema = z.object({
    username: z.string().min(3,"Username must be at least 3 characters long"),
    password: z.string().min(6,"Password must be at least 6 characters long"),
});

export const userRegisterSchema = z.object({
    username: z.string().min(3,"Username must be at least 3 characters long"),
    email: z.string().email(),
    password: z.string().min(6,"Password must be at least 6 characters long"),
    roleId: z.number(),
});