import request from "supertest";
import app from "@/app";

describe("GET /", () => {
    it("responds with a JSON success response", async () => {
        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: "Mock Premier League API.",
        });
    });
});

describe("Error Handling - Fallback route", () => {
    it("responds with a 404 Not Found error o hitting a non-existent route", async () => {
        const response = await request(app).get("/nonexistent-route");

        expect(response.status).toBe(404);
        expect(response.body.error).toEqual("Requested route not found");
    });
});
