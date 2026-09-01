import express from "express";

type Status = "Todo" | "In Progress" | "Done";
type Priority = "Low" | "Medium" | "High";

type Issue = {
    id: number;
    title: string;
    status: Status;
    priority: Priority;
};

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

app.get("/api/issues", (_request, response) => {
    response.json(issues);
});

app.post("/api/issues", (request, response) => {
    const { title, priority } = request.body;

    if (typeof title !== "string" || title.trim() === "") {
        response.status(400).json({
            message: "Title is required.",
        });

        return;
    }

    if (
        priority !== "Low" &&
        priority !== "Medium" &&
        priority !== "High"
    ) {
        response.status(400).json({
            message: "Invalid priority.",
        });

        return;
    }

    const nextId =
        Math.max(
            0,
            ...issues.map((issue) => issue.id)
        ) + 1;

    const newIssue: Issue = {
        id: nextId,
        title: title.trim(),
        status: "Todo",
        priority,
    };

    issues = [...issues, newIssue];

    response.status(201).json(newIssue);
});

app.patch("/api/issues/:id", (request, response) => {
    const id = Number(request.params.id);
    const { status } = request.body;

    if (!Number.isInteger(id)) {
        response.status(400).json({
            message: "Invalid issue ID.",
        });

        return;
    }

    if (
        status !== "Todo" &&
        status !== "In Progress" &&
        status !== "Done"
    ) {
        response.status(400).json({
            message: "Invalid status.",
        });

        return;
    }

    const issue = issues.find(
        (issue) => issue.id === id
    );

    if (!issue) {
        response.status(404).json({
            message: "Issue not found.",
        });

        return;
    }

    const updatedIssue: Issue = {
        ...issue,
        status,
    };

    issues = issues.map((issue) =>
        issue.id === id ? updatedIssue : issue
    );

    response.json(updatedIssue);
})

app.listen(PORT, () => {
    console.log(`IssueFlow API running on port ${PORT}`);
});
