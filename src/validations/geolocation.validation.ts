import{z} from "zod";

export const geolocationSchema = z.object({
    attendanceId: z.number(),
    latitude: z.string(),
    longitude: z.string(),
});