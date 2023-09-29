import waitForRedis from "@/helpers/wait-for-redis";
import rateLimit from "express-rate-limit";
import RateLimitRedisStore from "rate-limit-redis";
import { Response, Request } from "express";
import { rateLimitMaxRequest, rateLimitWindowInMinutes } from "@/config";

const redisClient = waitForRedis();

export default rateLimit({
    store: new RateLimitRedisStore({
        expiry: rateLimitWindowInMinutes * 60, // how long each rate limiting window exists for
        // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
        sendCommand: (...args: string[]) => redisClient.call(...args),
    }),
    windowMs: rateLimitWindowInMinutes * 60 * 1000, // allow max of X requests in Y milliseconds from an IP
    max: rateLimitMaxRequest, // e.g. limit each IP to 100 requests per windowMs
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: function (_req: Request, res: Response /*next*/) {
        return res.status(429).json({
            status: false,
            error: `You have exceeded the ${process.env.RATE_LIMIT_MAX_REQUEST} requests in ${process.env.RATE_LIMIT_WINDOW_IN_MINUTES} minutes limit. Please try again in ${process.env.RATE_LIMIT_WINDOW_IN_MINUTES} minutes`,
        });
    },
});
