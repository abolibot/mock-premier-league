import RedisStore from "connect-redis";
import session from "express-session";
import { randomUUID } from "crypto";
import waitForRedis from "@/helpers/wait-for-redis";
import { sessionCookieConfiguration, sessionSecret } from "@/config";
import { Request, RequestHandler } from "express";

const redisClient = waitForRedis();

const redisStore = new RedisStore({
    client: redisClient,
});

export const sessionHandler: RequestHandler = session({
    cookie: sessionCookieConfiguration,
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    genid: function (_req: Request) {
        return randomUUID(); // use UUIDs for session IDs
    },
    secret: sessionSecret,
});
