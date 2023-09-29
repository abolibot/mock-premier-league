import request from "supertest";
import app from "@/app";

describe("POST /api/v1/admins", () => {
    it("admin should be able to register new admins", async () => {
        const cookie = await global.getAdminAuthCookie();

        const response = await request(app)
            .post("/api/v1/admins")
            .set("Cookie", cookie)
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                password: "password123",
                password_confirm: "password123",
            })
            .expect(201);

        expect(response.body.data.is_admin).toBe(true);
    });
});
