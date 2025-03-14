import { Office, OfficeSchedule } from "@prisma/client";

export type OfficeRequest = {
    name: string;
    latitude: string;
    longitude: string;
}
export type OfficeResponse = {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
}

