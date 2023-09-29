import Bull, { Queue } from "bull";
import { Logger } from "moment-logger";
import Redis, { RedisOptions } from "ioredis";

import { redisConfiguration, isProduction } from "@/config";

const logger = new Logger({
    prefix: "Queue",
    showErrorStack: !isProduction,
});

const waitForListener = (target: Redis, event: string) =>
    new Promise((resolve) => target.once(event, resolve));

const handleRedisError = (error: Error) => {
    logger.error(`Redis error`, error);
};

const handleError = (error: Error) => {
    logger.error(`Error processing job`, error);
};

const handleCompletion = (job: Bull.Job, result: any) => {
    logger.log(`Job ${job.id} completed with result: ${result}`);
};

export default async (
    name: string,
    queueOptions: Bull.QueueOptions = {},
): Promise<Queue> => {
    const redisOptions: RedisOptions = {
        ...redisConfiguration,
        tls: undefined,
        lazyConnect: false,
        showFriendlyErrorStack: true,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    };

    const client = new Redis(redisOptions);

    client.on("error", handleRedisError);

    await waitForListener(client, "connect");

    const subscriber = client.duplicate();

    subscriber.on("error", handleRedisError);

    const queue = new Bull(name, {
        createClient: (type) => {
            switch (type) {
                case "client":
                    return client;
                case "subscriber":
                    return subscriber;
                default:
                    return client;
            }
        },
        ...queueOptions,
    });

    queue.on("error", handleError);
    queue.on("completed", handleCompletion);

    return queue;
};
