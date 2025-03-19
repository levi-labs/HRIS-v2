import {z} from "zod";

export const officeSchema = z.object({
    name: z.string().min(2,"Name must be at least 2 characters long"),
    latitude: z.string().min(8,"Latitude must be at least 2 characters long"),
    longitude: z.string().min(8,"Longitude must be at least 2 characters long"),
});