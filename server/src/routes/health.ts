import { Router } from "express";

import { pool } from "../db.js";

const router = Router();

router.get("/", async (_request, response) => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS database_time"
        );

        response.json({
            status: "ok",
            databaseTime:
                result.rows[0].database_time,
        });
    } catch (error) {
        console.error(
            "Database connection failed:",
            error
        );

        response.status(500).json({
            status: "error",
        });
    }
});

export default router;
