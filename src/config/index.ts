import dotenv from "dotenv";

import validate, {
    RequiredEnvironment,
    RequiredEnvironmentTypes,
} from "@boxpositron/vre";

dotenv.config();

const runtimeEnvironment: RequiredEnvironment[] = [
    {
        name: "PORT",
        type: RequiredEnvironmentTypes.Number,
    },
];

validate(runtimeEnvironment);

export const isProduction: boolean = process.env.NODE_ENV === "production";
export const port: number = parseInt(process.env.PORT ?? "3000");

export const allowedDomains: string[] =
    process.env.ALLOWED_DOMAINS?.split(",") ?? [];
