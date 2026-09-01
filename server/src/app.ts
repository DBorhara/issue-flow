import express from "express";

import healthRouter from "./routes/health.js";
import issuesRouter from "./routes/issues.js";

const app = express();

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/issues", issuesRouter);

export default app;
