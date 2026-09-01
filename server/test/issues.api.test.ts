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

// At the beginning of each test:
// Truncate: Delete all rows
// Restart Identity: Reset all ids
beforeEach(async () => {
    await pool.query(
        "TRUNCATE TABLE issues RESTART IDENTITY"
    );
});

afterAll(async () => {
    await pool.end();
});

// Seed helper function
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
    // Create
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

    // Create: Empty title
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

    // Create: Invalid priority
    it("rejects an invalid priority", async () => {
        const response = await request(app)
            .post("/api/issues")
            .send({
                title: "Fix login bug",
                priority: "Critical",
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid priority.",
        });
    })

    // Read All
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


    // Update
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

    // Update: Invalid status update
    it("rejects an invalid status update", async () => {
        const issue = await seedIssue();

        const response = await request(app)
            .patch(`/api/issues/${issue.id}`)
            .send({
                status: "Almost Done",
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid status.",
        });
    });

    // Update: Error 404
    it("returns 404 when updating a missing issue", async () => {
        const response = await request(app)
            .patch("/api/issues/999")
            .send({
                status: "Done",
            });

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
            message: "Issue not found.",
        });
    });

    // Update: Empty title
    it("rejects an empty title update", async () => {
        const issue = await seedIssue();

        const response = await request(app)
            .patch(`/api/issues/${issue.id}`)
            .send({
                title: "",
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid title.",
        });
    });

    // Update: Invalid priority
    it("rejects an invalid priority update", async () => {
        const issue = await seedIssue();

        const response = await request(app)
            .patch(`/api/issues/${issue.id}`)
            .send({
                priority: "Critical",
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid priority.",
        });
    });

    //Update: Invalid id
    it("rejects an invalid issue ID when updating", async () => {
        const response = await request(app)
            .patch("/api/issues/banana")
            .send({
                status: "Done",
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid issue ID.",
        });
    });


    // Delete
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
    // Delete: Missing issue
    it("returns 404 when deleting a missing issue", async () => {
        const response = await request(app)
            .delete("/api/issues/999");

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
            message: "Issue not found.",
        });
    });
    // Delete: Invalid issue id
    it("rejects an invalid issue ID", async () => {
        const response = await request(app)
            .delete("/api/issues/banana");

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid issue ID.",
        });
    });
});

describe("Health API", () => {
    it("reports a healthy database connection", async () => {
        const response = await request(app)
            .get("/api/health");

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            status: "ok",
        });

        expect(
            response.body.databaseTime
        ).toBeDefined();
    });
});
