import { RoleResponse } from "./role.type.js";

export type UserRequest = {
    username: string;
    email: string;
    roleId: number;
}
export type UserResponse = {
    id: number;
    username: string;
    email: string;
    roleId: number;
    
}

export type UserPassword = {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}