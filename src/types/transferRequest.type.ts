import { TransferRequestStatus, User } from "@prisma/client";

export type TransferRequestForEmployee = {
   employeeId : User['id']
   fromOffice : number
   toOffice : number
   status: TransferRequestStatus
   
}

export type TransferRequestForHrd = {
    employeeId : number
    fromOffice : number 
    toOffice : number
    status: TransferRequestStatus
    approvedBy: User['id']
}

export type TransferRequestResponse = {
    id: number
    employeeId: number
    fromOffice: number
    toOffice: number
    status: TransferRequestStatus
    requestDate: Date
}