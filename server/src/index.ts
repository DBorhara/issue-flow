import express from "express";

const app = express();

const PORT = 3001;

app.use(express.json());

app.get("/api/issues", (_request, response) => {
    response.json([
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
    ]);
});

app.listen(PORT, () => {
    console.log(`IssueFlow API running on port ${PORT}`);
});
