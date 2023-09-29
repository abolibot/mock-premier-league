import logger from "moment-logger";
import http from "http";
import { Application, Express } from "express";
import app from "@/app";

import { port, isProduction } from "@/config";
import waitForRedis from "@/helpers/wait-for-redis";
import waitForMongoose from "@/helpers/wait-for-mongoose";
// import createQueue from "@/helpers/create-queue";
import defaultAdminSeeder from "./database/seeders/default-admin.seeder";

const start = (app: Express, port: number): Promise<Application> =>
    new Promise((resolve, reject) => {
        const server = http.createServer(app);

        server.once("listening", () => resolve(app));
        server.on("error", reject);

        server.listen(port);
    });

logger.log("Starting Server");

logger.info(`Running in ${isProduction ? "production" : "development"} mode`);

logger.log("Waiting for Database");

await waitForMongoose();

logger.info("Connected to Database");

logger.log("Waiting for Redis");

await waitForRedis();

logger.info("Connected to Redis");

await defaultAdminSeeder();

logger.log("Seeded default admin user");

// const defaultAdminSeedQueue = await createQueue("seed-default-admin");
// defaultAdminSeedQueue.process(handleMessage);

await start(app, port);

logger.info(`Server started on port ${port}`);
