import { pool } from "../db.js";

import type {
    Issue,
    Priority,
    Status,
} from "../types.js";

type IssueUpdate = {
    title?: string;
    status?: Status;
    priority?: Priority;
};
//Get all
export async function getAllIssues(): Promise<Issue[]> {
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

    return result.rows;
}
// Create
export async function createIssue(
    title: string,
    priority: Priority
): Promise<Issue> {
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
        [title, priority]
    );

    return result.rows[0];
}
// Update
export async function updateIssue(
    id: number,
    updates: IssueUpdate
): Promise<Issue | null> {
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
            updates.title ?? null,
            updates.status ?? null,
            updates.priority ?? null,
            id,
        ]
    );

    return result.rows[0] ?? null;
}
// Delete
export async function deleteIssue(
    id: number
): Promise<boolean> {
    const result = await pool.query(
        `
      DELETE FROM issues
      WHERE id = $1
      RETURNING id
    `,
        [id]
    );

    return (result.rowCount ?? 0) > 0;
}
