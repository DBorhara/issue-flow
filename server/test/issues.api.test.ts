import request from "supertest";

import {
    afterAll,
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import app from "../src/app.js";
import { pool } from "../src/db.js";

beforeEach(async () => {
    await pool.query(
        "TRUNCATE TABLE issues RESTART IDENTITY"
    );
});

afterAll(async () => {
    await pool.end();
});

async function seedIssue() {
    const result = await pool.query(
        `
      INSERT INTO issues (
        title,
        priority
      )
      VALUES ($1, $2)
      RETURNING
        id,
        title,
        status,
        priority
    `,
        [
            "Test issue",
            "Medium",
        ]
    );

    return result.rows[0];
}

describe("Issue API", () => {
    it("creates an issue", async () => {
        const response = await request(app)
            .post("/api/issues")
            .send({
                title: "Fix login bug",
                priority: "High",
            });

        expect(response.status).toBe(201);

        expect(response.body).toMatchObject({
            id: 1,
            title: "Fix login bug",
            status: "Todo",
            priority: "High",
        });

        const result = await pool.query(
            `
        SELECT
          title,
          status,
          priority
        FROM issues
      `
        );

        expect(result.rows).toHaveLength(1);

        expect(result.rows[0]).toMatchObject({
            title: "Fix login bug",
            status: "Todo",
            priority: "High",
        });
    });

    it("rejects an empty issue title", async () => {
        const response = await request(app)
            .post("/api/issues")
            .send({
                title: "",
                priority: "High",
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "Title is required.",
        });
    });

    it("returns issues", async () => {
        await seedIssue();

        const response = await request(app)
            .get("/api/issues");

        expect(response.status).toBe(200);

        expect(response.body).toHaveLength(1);

        expect(response.body[0]).toMatchObject({
            title: "Test issue",
            status: "Todo",
            priority: "Medium",
        });
    });

    it("updates an issue", async () => {
        const issue = await seedIssue();

        const response = await request(app)
            .patch(`/api/issues/${issue.id}`)
            .send({
                status: "Done",
            });

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            id: issue.id,
            title: "Test issue",
            status: "Done",
            priority: "Medium",
        });

        const result = await pool.query(
            `
        SELECT status
        FROM issues
        WHERE id = $1
      `,
            [issue.id]
        );

        expect(result.rows[0].status).toBe("Done");
    });

    it("deletes an issue", async () => {
        const issue = await seedIssue();

        const response = await request(app)
            .delete(`/api/issues/${issue.id}`);

        expect(response.status).toBe(204);

        const result = await pool.query(
            `
        SELECT id
        FROM issues
        WHERE id = $1
      `,
            [issue.id]
        );

        expect(result.rows).toHaveLength(0);
    });
});
