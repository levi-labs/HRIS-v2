import { LeaveStatus, LeaveType, User } from "@prisma/client";

export type LeaveRequestFromHRD = {
    employeeId: number;
    startDate: string;
    endDate: string;
    reason: string;
    leaveType: LeaveType;
    status: LeaveStatus;
};

export type LeaveRequestFromEmployee = {
    user: User;
    startDate: string;
    endDate: string;
    reason: string;
    leaveType: LeaveType;
    
}

export type LeaveRequestResponse = {
    id: number;
    employeeId: number;
    startDate: string;
    endDate: string;
    reason: string;
    leaveType: string;
    status: string;
};