import { LeaveStatus, LeaveType } from "@prisma/client";

export type LeaveRequestRequest = {
    employeeId: number;
    startDate: string;
    endDate: string;
    reason: string;
    leaveType: LeaveType;
    status: LeaveStatus;
};

export type LeaveRequestResponse = {
    id: number;
    employeeId: number;
    startDate: string;
    endDate: string;
    reason: string;
    leaveType: string;
    status: string;
};