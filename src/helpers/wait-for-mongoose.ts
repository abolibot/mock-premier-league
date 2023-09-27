import mongoose, { Connection } from "mongoose";
import { mongoUri } from "@/config";

const waitForListener = (target: Connection, event: string) =>
    new Promise((resolve) => target.once(event, resolve));

export default async function () {
    mongoose.connect(mongoUri);
    const connection = mongoose.connection;

    await waitForListener(connection, "connected");
}
