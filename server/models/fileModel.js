const pool = require('../config/db');
const fs = require("fs");

const uploadFile = async (taskId, userId, file) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Check task exists
        const taskResult = await client.query(
            `SELECT *
             FROM tasks
             WHERE id = $1`,
            [taskId]
        );

        const task = taskResult.rows[0];

        if (!task) {
            throw new Error("Task not found");
        }

        // Check project membership
        const memberResult = await client.query(
            `SELECT *
             FROM project_members
             WHERE project_id = $1
             AND user_id = $2`,
            [
                task.project_id,
                userId
            ]
        );

        const member = memberResult.rows[0];

        if (!member) {
            throw new Error("Access denied");
        }

        // Insert file
        const fileResult = await client.query(
            `INSERT INTO files
(
    filename,
    original_name,
    filepath,
    mime_type,
    file_size,
    task_id,
    uploaded_by
)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING *;`,
            [
                file.filename,
                file.originalname,
                file.path,
                file.mimetype,
                file.size,
                taskId,
                userId
            ]
        );

        const uploadedFile = fileResult.rows[0];

        // Notify task creator (if uploader isn't the creator)
        if (task.created_by !== userId) {

            await client.query(
                `INSERT INTO notifications
                (
                    user_id,
                    message,
                    task_id
                )
                VALUES ($1, $2, $3)`,
                [
                    task.created_by,
                    "A new file was uploaded to your task.",
                    task.id
                ]
            );

        }

        // Activity log
        await client.query(
            `INSERT INTO activity_logs
            (
                user_id,
                action,
                description,
                project_id,
                task_id
            )
            VALUES ($1, $2, $3, $4, $5)`,
            [
                userId,
                "FILE_UPLOADED",
                `Uploaded file "${file.originalname}" to task "${task.title}"`,
                task.project_id,
                task.id
            ]
        );

        await client.query("COMMIT");

        return uploadedFile;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }

};



const getTaskFiles = async (taskId, userId) => {

    // Check task exists
    const taskResult = await pool.query(
        `SELECT *
         FROM tasks
         WHERE id = $1`,
        [taskId]
    );

    const task = taskResult.rows[0];

    if (!task) {
        throw new Error("Task not found");
    }

    // Check project membership
    const memberResult = await pool.query(
        `SELECT *
         FROM project_members
         WHERE project_id = $1
         AND user_id = $2`,
        [
            task.project_id,
            userId
        ]
    );

    const member = memberResult.rows[0];

    if (!member) {
        throw new Error("Access denied");
    }

    // Get task files
    const filesResult = await pool.query(
        `SELECT *
         FROM files
         WHERE task_id = $1
         ORDER BY created_at DESC`,
        [taskId]
    );

    return filesResult.rows;

};


const deleteFile = async (fileId, userId) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Check file exists
        const fileResult = await client.query(
            `SELECT *
             FROM files
             WHERE id = $1`,
            [fileId]
        );

        const file = fileResult.rows[0];

        if (!file) {
            throw new Error("File not found");
        }

        // Only uploader can delete
        if (file.uploaded_by !== userId) {
            throw new Error("Access denied");
        }

        // Get task details
        const taskResult = await client.query(
            `SELECT *
             FROM tasks
             WHERE id = $1`,
            [file.task_id]
        );

        const task = taskResult.rows[0];

        // Delete physical file
        fs.unlinkSync(file.filepath);

        // Delete database record
        await client.query(
            `DELETE FROM files
             WHERE id = $1`,
            [fileId]
        );

        // Activity log
        await client.query(
            `INSERT INTO activity_logs
            (
                user_id,
                action,
                description,
                project_id,
                task_id
            )
            VALUES ($1, $2, $3, $4, $5)`,
            [
                userId,
                "FILE_DELETED",
                `Deleted file "${file.original_name}" from task "${task.title}"`,
                task.project_id,
                task.id
            ]
        );

        await client.query("COMMIT");

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }

};