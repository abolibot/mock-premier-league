import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express, { Express } from "express";
import "express-async-errors";
import { Response, Request } from "express";
import limiter from "./helpers/rate-limiter";

import { isProduction, allowedDomains } from "./config";
import { jsonSuccessResponse } from "./helpers/utils";
import NotFoundError from "./errors/not-found.error";
import routes from "./routes";
import errorHandler from "./middlewares/error-handler";
import { sessionHandler } from "./helpers/session";

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

// for rate limiter
app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(morgan(isProduction ? "combined" : "dev"));

// rate limiting
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize sesssion storage.
app.use(sessionHandler);

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
