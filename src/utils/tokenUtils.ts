import jwt from "jsonwebtoken";


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';

const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
}

const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
}

export {generateAccessToken, generateRefreshToken};