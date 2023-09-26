import request from "supertest";
import app from "@/app";

describe("GET /health", () => {
    it("responds with status code 200", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
    });
});
