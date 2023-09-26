import logger from "moment-logger";
import http from "http";
import { Application, Express } from "express";
import app from "@/app";

import { port, isProduction } from "@/config";

const start = (app: Express, port: number): Promise<Application> =>
    new Promise((resolve, reject) => {
        const server = http.createServer(app);

        server.once("listening", () => resolve(app));
        server.on("error", reject);

        server.listen(port);
    });

logger.log("Starting Server");

logger.info(`Running in ${isProduction ? "production" : "development"} mode`);

await start(app, port);

logger.info(`Server started on port ${port}`);
