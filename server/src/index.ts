import app from "./app.js";

const PORT = 3001;

app.listen(PORT, () => {
    console.log(
        `IssueFlow API running on port ${PORT}`
    );
});
