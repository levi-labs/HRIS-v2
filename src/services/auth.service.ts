import prisma from '../config/prisma.js';
import { ResponseError } from '../error/response.errors.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import {
    UserLoginRequest,
    UserLoginResponse,
    UserRegisterRequest,
    UserRegisterResponse,
} from '../types/auth.type.js';
import { generateAccessToken } from '../utils/tokenUtils.js';
import { userLoginSchema, userRegisterSchema } from '../validations/auth.validation.js';
import { Validation } from '../validations/validation.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export class AuthService {
    static async register(req: UserRegisterRequest): Promise<UserRegisterResponse> {
        const validated: UserRegisterRequest = Validation.validate(userRegisterSchema, req);
        const countUser = await prisma.user.count({
            where: {
                username: validated.username,
            },
        });
        if (countUser > 0) {
            throw new ResponseError(409, 'User already exists');
        }

        const hashedPassword = await bcrypt.hash(validated.password, 10);
        const user = await prisma.user.create({
            data: {
                username: validated.username,
                email: validated.username,
                password: hashedPassword,
                role: {
                    connect: {
                        id: validated.roleId,
                    },
                },
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return user;
    }

    static async login(req: UserLoginRequest): Promise<UserLoginResponse> {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const validated: UserLoginRequest = Validation.validate(userLoginSchema, req);
        const user = await prisma.user.findUnique({
            where: {
                username: validated.username,
            },
            select: {
                id: true,
                username: true,
                password: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!user) {
            throw new ResponseError(401, 'Username or password is incorrect');
        }

        const checkPassword = await bcrypt.compare(validated.password, user.password);
        if (!checkPassword) {
            throw new ResponseError(401, 'Username or password is incorrect');
        }

        const token = generateAccessToken({
            id: user.id,
            username: user.username,
            role: user.role,
        });

        if (!secret) {
            throw new ResponseError(500, 'Token secret not found');
        }
        const decodedToken = jwt.verify(token, secret) as jwt.JwtPayload;

        if (!decodedToken || !decodedToken.exp) {
            throw new ResponseError(500, 'Failed to verify token');
        }

        const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);

        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token,
            expiresIn: expiresIn.toString(),
        };
    }

    static async me(token: any): Promise<any> {
        const currentToken = token;
        if (!currentToken) {
            throw new ResponseError(401, 'Unauthorized : Token is missing or invalid');
        }
        const user = jwt.verify(
            currentToken,
            process.env.ACCESS_TOKEN_SECRET || '',
        ) as jwt.JwtPayload;

        return user;
    }

    //delete cookie token
}
