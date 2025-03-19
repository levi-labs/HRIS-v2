
export type GeolocationRequest = {
    attendanceId: number;
    latitude: string;
    longitude: string;
}

export type GeolocationCheckInResponse = {
    id: number;
    attendanceId: number;
    checkInLatitude: string;
    checkInLongitude: string;
}

export type GeolocationCheckOutResponse = {
    id: number;
    attendanceId: number;
    checkOutLatitude: string;
    checkOutLongitude: string;
}