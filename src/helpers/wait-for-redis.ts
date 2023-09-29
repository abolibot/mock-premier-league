import Redis from "ioredis";
import RedisMock from "ioredis-mock";
import { redisConfiguration, isTest } from "@/config";
import logger from "moment-logger";

export const waitForListener = (target: Redis, event: string) =>
    new Promise((resolve) => target.once(event, resolve));

export default (): Redis => {
    const client = new Redis(redisConfiguration);

    client.on("error", (error: Error) => {
        logger.error(`Redis error`, error);
    });

    return isTest ? new RedisMock() : client;
    // return new RedisMock();
};
