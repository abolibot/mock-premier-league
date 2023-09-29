import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express, { Express } from "express";
import "express-async-errors";
import { Response, Request } from "express";
import RedisStore from "connect-redis";
import Redis from "ioredis";
import session from "express-session";
import { randomUUID } from "crypto";
import rateLimit from "express-rate-limit";
import RateLimitRedisStore from "rate-limit-redis";

import {
    isProduction,
    allowedDomains,
    redisConfiguration,
    sessionCookieConfiguration,
    sessionSecret,
    rateLimitMaxRequest,
    rateLimitWindowInMinutes,
} from "./config";
import { jsonSuccessResponse } from "./helpers/utils";
import NotFoundError from "./errors/not-found.error";
import routes from "./routes";
import errorHandler from "./middlewares/error-handler";

const redisClient = new Redis(redisConfiguration);

const limiter = rateLimit({
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

const app: Express = express();

const whitelist = allowedDomains ?? [];

const corsOptions: CorsOptions = {
    origin: async (origin, callback) => {
        if (!origin) return callback(null, true);

        if (whitelist.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        callback(new Error(`Not allowed by CORS - ${origin}`));
    },
    allowedHeaders: ["Authorization", "X-Requested-With", "Content-Type"],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan(isProduction ? "combined" : "dev"));

// rate limiting
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize store.
const redisStore = new RedisStore({
    client: redisClient,
});

// Initialize sesssion storage.
app.use(
    session({
        cookie: sessionCookieConfiguration,
        store: redisStore,
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        genid: function (_req: Request) {
            return randomUUID(); // use UUIDs for session IDs
        },
        secret: sessionSecret,
    }),
);

app.get("/", (_req: Request, res: Response) => {
    const message = "Mock Premier League API.";
    return jsonSuccessResponse(res, 200, message);
});

app.use(routes);

app.all("*", async () => {
    throw new NotFoundError("Requested route not found");
});

app.use(errorHandler);

export default app;
