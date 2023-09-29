import request from "supertest";
import app from "@/app";

describe("POST /api/v1/auth/signup", () => {
    it("returns 201 and signup user when valid request body", async () => {
        const response = await request(app).post("/api/v1/auth/signup").send({
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@example.com",
            password: "password123",
            password_confirm: "password123",
        });

        expect(response.status).toBe(201);
    });

    it("only regular users can signup", async () => {
        const response = await request(app).post("/api/v1/auth/signup").send({
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@example.com",
            password: "password123",
            password_confirm: "password123",
        });

        expect(response.body.data.is_admin).toBe(false);
    });

    it("sets a cookie after successful signup", async () => {
        const response = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                password: "password123",
                password_confirm: "password123",
            })
            .expect(201);

        expect(response.get("Set-Cookie")).toBeDefined();
    });

    it("returns an error for invalid request body", async () => {
        const response = await request(app).post("/api/v1/auth/signup").send({
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@example.com",
        });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty("errors");
    });

    it("returns 400 if an existing user tries to signup", async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                password: "password123",
                password_confirm: "password123",
            })
            .expect(201);

        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                password: "password123",
                password_confirm: "password123",
            })
            .expect(400);
    });
});

describe("POST /api/v1/auth/signin", () => {
    it("returns 401 when a user that does not exist attempts to sign in", async () => {
        await request(app)
            .post("/api/v1/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "password123",
            })
            .expect(401);
    });

    it("returns 200 when an existing user attempts to sign in", async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                password: "password123",
                password_confirm: "password123",
            })
            .expect(201);

        await request(app)
            .post("/api/v1/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "password123",
            })
            .expect(200);
    });

    it("sets a cookie after successful signin", async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                password: "password123",
                password_confirm: "password123",
            })
            .expect(201);

        const response = await request(app)
            .post("/api/v1/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "password123",
            })
            .expect(200);

        expect(response.get("Set-Cookie")).toBeDefined();
    });

    it("returns an error for invalid request body", async () => {
        const response = await request(app).post("/api/v1/auth/signup").send({
            password: "",
            email: "johndoe@example.com",
        });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty("errors");
    });

    it("returns 401 if an existing user tries to signin with invalid credentials", async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                password: "password123",
                password_confirm: "password123",
            })
            .expect(201);

        await request(app)
            .post("/api/v1/auth/signin")
            .send({
                email: "johndoe@example.com",
                password: "password",
            })
            .expect(401);
    });
});

describe("GET /api/v1/auth/signout", () => {
    it("signed out cookie shouldn't be reusable", async () => {
        const cookie = await global.getAuthCookie();

        await request(app)
            .get("/api/v1/auth/signout")
            .set("Cookie", cookie)
            .expect(200);

        await request(app)
            .get("/api/v1/auth/current-user")
            .set("Cookie", cookie)
            .expect(401);
    });
});
