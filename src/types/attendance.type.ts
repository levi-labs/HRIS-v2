export type AttendanceResponse = {
    id: number;
    employeeId: number;
    date: Date;
    checkIn: string;
    checkOut?: string | null;
    latitude: string;
    longitude: string;
};

export type AttendanceRequest = {
    employeeId: number;
    latitude: string;
    longitude: string;
};