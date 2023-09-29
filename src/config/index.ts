import dotenv from "dotenv";
import { CookieOptions } from "express-session";
import { RedisOptions } from "ioredis";
import { SignOptions } from "jsonwebtoken";
import { randomUUID } from "crypto";

dotenv.config();

export const isProduction: boolean = process.env.NODE_ENV === "production";
export const port: number = parseInt(process.env.PORT ?? "3000");

export const allowedDomains: string[] =
    process.env.ALLOWED_DOMAINS?.split(",") ?? [];

export const redisConfiguration: RedisOptions = {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME ?? "",
    password: process.env.REDIS_PASSWORD ?? "",
};

export const sessionCookieConfiguration: CookieOptions = {
    httpOnly: isProduction ? true : false,
    secure: isProduction ? true : false,
    maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN_HOURS!) * 60 * 60 * 1000,
};

export const sessionSecret = process.env.SESSION_SECRET!;
export const jwtSecret = process.env.JWT_SECRET!;

export const jwtConfiguration: SignOptions = {
    expiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN_HOURS!) * 60 * 60,
    issuer: process.env.JWT_ISS!,
    jwtid: randomUUID(),
};

export const mongoUri: string = process.env.MONGO_URI!;

export const rateLimitMaxRequest: number = parseInt(
    process.env.RATE_LIMIT_MAX_REQUEST!,
);
export const rateLimitWindowInMinutes: number = parseInt(
    process.env.RATE_LIMIT_WINDOW_IN_MINUTES!,
);
