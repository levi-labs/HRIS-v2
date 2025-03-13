import { RoleResponse } from "./role.type.js";

export type UserRegisterRequest = {
    username: string;
    email: string;
    password: string;
    roleId: number
}
export type UserRegisterResponse = {
    id: number;
    username: string;
    email: string;
    role: RoleResponse
}
export type UserLoginRequest = {
    username: string;
    password: string;
}


export type UserLoginResponse = {
    id: number;
    username: string;
    role: RoleResponse
    token: string;
    expiresIn: string
}
