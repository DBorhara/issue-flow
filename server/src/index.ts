import express from "express";
import { pool } from "./db.js";

type Status = "Todo" | "In Progress" | "Done";
type Priority = "Low" | "Medium" | "High";

type Issue = {
    id: number;
    title: string;
    status: Status;
    priority: Priority;
};

function isStatus(value: unknown): value is Status {
    return (
        value === "Todo" ||
        value === "In Progress" ||
        value === "Done"
    );
}

function isPriority(value: unknown): value is Priority {
    return (
        value === "Low" ||
        value === "Medium" ||
        value === "High"
    );
}

const app = express();
const PORT = 3001;

app.use(express.json());

let issues: Issue[] = [
    {
        id: 1,
        title: "Login button does not work",
        status: "Todo",
        priority: "High",
    },
    {
        id: 2,
        title: "Create dashboard layout",
        status: "In Progress",
        priority: "Medium",
    },
    {
        id: 3,
        title: "Add search functionality",
        status: "Done",
        priority: "Low",
    },
];

app.get("/api/health", async (_request, response) => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS database_time"
        );

        response.json({
            status: "ok",
            databaseTime: result.rows[0].database_time,
        });
    } catch (error) {
        console.error("Database connection failed:", error);

        response.status(500).json({
            status: "error",
        });
    }
});

app.get("/api/issues", async (_request, response) => {
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
        console.error("Unable to load issues:", error);

        response.status(500).json({
            message: "Unable to load issues.",
        });
    }
});

app.post("/api/issues", async (request, response) => {
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
            // Parameterize Query
            // $1 = title.trim()
            // $2 = priority
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

app.patch("/api/issues/:id", async (request, response) => {
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
        (typeof title !== "string" || title.trim() === "")
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
            // COALESCE : Give me the first value that isn't NULL.
            // Lets us change only supplied properties
            // without seperate SQL queries.
            [
                title === undefined ? null : title.trim(),
                status === undefined ? null : status,
                priority === undefined ? null : priority,
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
})

app.delete("/api/issues/:id", (request, response) => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id)) {
        response.status(400).json({
            message: "Invalid issue ID.",
        });

        return;
    }
    // .some : Does at least one element satisfy this condition?
    const issueExists = issues.some(
        (issue) => issue.id === id
    );

    if (!issueExists) {
        response.status(404).json({
            message: "Issue not found.",
        });

        return;
    }

    issues = issues.filter(
        (issue) => issue.id !== id
    );

    response.status(204).send();
});

app.listen(PORT, () => {
    console.log(`IssueFlow API running on port ${PORT}`);
});
