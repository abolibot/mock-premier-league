import Redis from "ioredis";
import { redisConfiguration } from "@/config";

const waitForListener = (target: Redis, event: string) =>
    new Promise((resolve) => target.once(event, resolve));

export default async function () {
    const client = new Redis(redisConfiguration);

    await waitForListener(client, "connect");
}
