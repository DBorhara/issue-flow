import express from "express";
import cors from "cors";

import healthRouter from "./routes/health.js";
import issuesRouter from "./routes/issues.js";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173"
    })
);

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/issues", issuesRouter);

export default app;
