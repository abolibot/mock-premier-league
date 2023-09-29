import { afterAll, beforeAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "@/app";
import { storeUser } from "@/services/user.service";

declare global {
    // eslint-disable-next-line no-var
    var getAuthCookie: () => Promise<string[]>;
    // eslint-disable-next-line no-var
    var getAdminAuthCookie: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
    process.env.NODE_ENV = "test";

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.getAuthCookie = async () => {
    const first_name = "John";
    const last_name = "Doe";
    const email = "test@test.com";
    const password = "password";

    const response = await request(app)
        .post("/api/v1/auth/signup")
        .send({
            first_name,
            last_name,
            email,
            password,
            password_confirm: password,
        })
        .expect(201);

    const cookie = response.get("Set-Cookie");

    return cookie;
};

global.getAdminAuthCookie = async () => {
    const userObj = {
        first_name: "admin",
        last_name: "user",
        email: "admin@test.com",
        password: "adminpassword",
        is_admin: true,
    };

    await storeUser(userObj);

    const response = await request(app)
        .post("/api/v1/auth/signin")
        .send({
            email: userObj.email,
            password: userObj.password,
        })
        .expect(200);

    const cookie = response.get("Set-Cookie");

    return cookie;
};
