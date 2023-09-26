import dotenv from "dotenv";

dotenv.config();

export const isProduction: boolean = process.env.NODE_ENV === "production";
export const port: number = parseInt(process.env.PORT ?? "3000");

export const allowedDomains: string[] =
    process.env.ALLOWED_DOMAINS?.split(",") ?? [];
