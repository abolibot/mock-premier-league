import dotenv from "dotenv";
import { RedisOptions } from "ioredis";

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

export const mongoUri: string = process.env.MONGO_URI!;
