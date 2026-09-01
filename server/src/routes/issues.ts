import { Router } from "express";


import {
    createIssue,
    getAllIssues,
    updateIssue,
    deleteIssue
} from "../repositories/issues.js";
import type { Issue } from "../types.js";
import {
    isPriority,
    isStatus,
} from "../validators.js";

const router = Router();

router.get("/", async (_request, response) => {
    try {
        const issues = await getAllIssues();
        response.json(issues);
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
        const newIssue = await createIssue(title.trim(), priority);
        response.status(201).json(newIssue);
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
        const updatedIssue = await updateIssue(
            id,
            {
                title:
                    typeof title === "string"
                        ? title.trim()
                        : undefined,

                status:
                    isStatus(status)
                        ? status
                        : undefined,

                priority:
                    isPriority(priority)
                        ? priority
                        : undefined,
            });

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
        const deleted = await deleteIssue(id);

        if (!deleted) {
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
