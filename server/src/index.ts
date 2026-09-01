import app from "./app.js";

const PORT = Number(process.env.port) || 3001;

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `IssueFlow API running on port ${PORT}`
    );
});
