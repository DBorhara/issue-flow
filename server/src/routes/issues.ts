import { Router } from "express";

import { pool } from "../db.js";
import type { Issue } from "../types.js";
import {
    isPriority,
    isStatus,
} from "../validators.js";

const router = Router();

router.get("/", async (_request, response) => {
    try {
        const result = await pool.query<Issue>(
            `
        SELECT
          id,
          title,
          status,
          priority
        FROM issues
        ORDER BY created_at DESC, id DESC
      `
        );

        response.json(result.rows);
    } catch (error) {
        console.error(
            "Unable to load issues:",
            error
        );

        response.status(500).json({
            message: "Unable to load issues.",
        });
    }
});

router.post("/", async (request, response) => {
    const { title, priority } = request.body;

    if (
        typeof title !== "string" ||
        title.trim() === ""
    ) {
        response.status(400).json({
            message: "Title is required.",
        });

        return;
    }

    if (!isPriority(priority)) {
        response.status(400).json({
            message: "Invalid priority.",
        });

        return;
    }

    try {
        const result = await pool.query<Issue>(
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
                title.trim(),
                priority,
            ]
        );

        response.status(201).json(
            result.rows[0]
        );
    } catch (error) {
        console.error(
            "Unable to create issue:",
            error
        );

        response.status(500).json({
            message: "Unable to create issue.",
        });
    }
});

router.patch("/:id", async (request, response) => {
    const id = Number(request.params.id);

    const {
        title,
        status,
        priority,
    }: {
        title?: unknown;
        status?: unknown;
        priority?: unknown;
    } = request.body;

    if (!Number.isInteger(id)) {
        response.status(400).json({
            message: "Invalid issue ID.",
        });

        return;
    }

    if (
        title !== undefined &&
        (
            typeof title !== "string" ||
            title.trim() === ""
        )
    ) {
        response.status(400).json({
            message: "Invalid title.",
        });

        return;
    }

    if (
        status !== undefined &&
        !isStatus(status)
    ) {
        response.status(400).json({
            message: "Invalid status.",
        });

        return;
    }

    if (
        priority !== undefined &&
        !isPriority(priority)
    ) {
        response.status(400).json({
            message: "Invalid priority.",
        });

        return;
    }

    try {
        const result = await pool.query<Issue>(
            `
        UPDATE issues
        SET
          title = COALESCE($1, title),
          status = COALESCE($2, status),
          priority = COALESCE($3, priority),
          updated_at = NOW()
        WHERE id = $4
        RETURNING
          id,
          title,
          status,
          priority
      `,
            [
                title === undefined
                    ? null
                    : title.trim(),

                status === undefined
                    ? null
                    : status,

                priority === undefined
                    ? null
                    : priority,

                id,
            ]
        );

        const updatedIssue = result.rows[0];

        if (!updatedIssue) {
            response.status(404).json({
                message: "Issue not found.",
            });

            return;
        }

        response.json(updatedIssue);
    } catch (error) {
        console.error(
            "Unable to update issue:",
            error
        );

        response.status(500).json({
            message: "Unable to update issue.",
        });
    }
});

router.delete("/:id", async (request, response) => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id)) {
        response.status(400).json({
            message: "Invalid issue ID.",
        });

        return;
    }

    try {
        const result = await pool.query(
            `
        DELETE FROM issues
        WHERE id = $1
        RETURNING id
      `,
            [id]
        );

        if (result.rowCount === 0) {
            response.status(404).json({
                message: "Issue not found.",
            });

            return;
        }

        response.status(204).send();
    } catch (error) {
        console.error(
            "Unable to delete issue:",
            error
        );

        response.status(500).json({
            message: "Unable to delete issue.",
        });
    }
});

export default router;
