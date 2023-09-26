import logger from "moment-logger";
import createServer, { CreateServerOptions } from "@/app";
import { Response, Request } from "express";

import routes from "@/routes";
import { port, isProduction, allowedDomains } from "@/config";
import NotFoundError from "@/errors/not-found.error";
import errorHandler from "@/middlewares/error-handler";
import { jsonSuccessResponse } from "@/helpers/utils";

// Start Server
logger.log("Starting Server");

logger.info(`Running in ${isProduction ? "production" : "development"} mode`);

const options: CreateServerOptions = {
    port,
    production: isProduction,
    whitelistedDomains: allowedDomains,
};

const app = await createServer(options);

logger.info(`Server started on port ${port}`);

app.get("/", (_req: Request, res: Response) => {
    const message = "Mock Premier League API.";
    return jsonSuccessResponse(res, 200, message);
});

app.use(routes);

app.all("*", async () => {
    throw new NotFoundError("Requested route not found");
});

app.use(errorHandler);
