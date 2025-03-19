import {z} from "zod";

export const userSchema = z.object({
    username: z.string().min(3,"Username must be at least 3 characters long"),
    email: z.string().email(),
    roleId: z.number(),
});

export const passwordSchema = z.object({
    newPassword: z.string().min(6,"Password must be at least 6 characters long"),
    oldPassword: z.string().min(6,"Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6,"Password must be at least 6 characters long"),
});