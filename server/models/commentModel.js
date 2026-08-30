const pool = require('../config/db')

const createComment = async (taskId, userId, content) => {

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

        // Check user is project member
        const memberResult = await client.query(
            `SELECT *
             FROM project_members
             WHERE project_id = $1
             AND user_id = $2`,
            [task.project_id, userId]
        );

        const member = memberResult.rows[0];

        if (!member) {
            throw new Error("Access denied");
        }

        // Create comment
        const commentResult = await client.query(
            `INSERT INTO comments
            (
                content,
                task_id,
                user_id
            )
            VALUES ($1, $2, $3)
            RETURNING *`,
            [
                content,
                task.id,
                userId
            ]
        );

        const comment = commentResult.rows[0];

        // Get all assignees except the commenter
        const assigneesResult = await client.query(
            `SELECT user_id
             FROM task_assignees
             WHERE task_id = $1
             AND user_id != $2`,
            [
                task.id,
                userId
            ]
        );

        // Create notifications
        for (const assignee of assigneesResult.rows) {

            await client.query(
                `INSERT INTO notifications
                (
                    user_id,
                    type,
                    message,
                    task_id,
                    project_id
                )
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    assignee.user_id,
                    "COMMENT_ADDED",
                    `New comment added to task "${task.title}"`,
                    task.id,
                    task.project_id
                ]
            );

        }

        // Create activity log
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
                "COMMENT_ADDED",
                `Added a comment to task "${task.title}"`,
                task.project_id,
                task.id
            ]
        );

        await client.query("COMMIT");

        return comment;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }

};




const getTaskComments = async (taskId, userId) => {

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

    // Check user is project member
    const memberResult = await pool.query(
        `SELECT *
         FROM project_members
         WHERE project_id = $1
         AND user_id = $2`,
        [task.project_id, userId]
    );

    const member = memberResult.rows[0];

    if (!member) {
        throw new Error("Access denied");
    }

    // Get comments
    const commentsResult = await pool.query(
        `SELECT
            comments.id,
            comments.content,
            comments.created_at,
            comments.updated_at,
            users.id AS user_id,
            users.name,
            users.avatar
         FROM comments
         JOIN users
            ON comments.user_id = users.id
         WHERE comments.task_id = $1
         ORDER BY comments.created_at ASC`,
        [taskId]
    );

    return commentsResult.rows;

};



const updateComment = async (commentId, userId, content) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Check comment exists
        const commentResult = await client.query(
            `SELECT *
             FROM comments
             WHERE id = $1`,
            [commentId]
        );

        const comment = commentResult.rows[0];

        if (!comment) {
            throw new Error("Comment not found");
        }

        // Check comment owner
        if (comment.user_id !== userId) {
            throw new Error("Access denied");
        }

        // Get task details
        const taskResult = await client.query(
            `SELECT *
             FROM tasks
             WHERE id = $1`,
            [comment.task_id]
        );

        const task = taskResult.rows[0];

        // Update comment
        const updatedCommentResult = await client.query(
            `UPDATE comments
             SET
                content = $1,
                updated_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [
                content,
                commentId
            ]
        );

        const updatedComment = updatedCommentResult.rows[0];

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
                "COMMENT_UPDATED",
                `Updated a comment on task "${task.title}"`,
                task.project_id,
                task.id
            ]
        );

        await client.query("COMMIT");

        return updatedComment;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }

};


const deleteComment = async (commentId, userId) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Check comment exists
        const commentResult = await client.query(
            `SELECT *
             FROM comments
             WHERE id = $1`,
            [commentId]
        );

        const comment = commentResult.rows[0];

        if (!comment) {
            throw new Error("Comment not found");
        }

        // Check comment owner
        if (comment.user_id !== userId) {
            throw new Error("Access denied");
        }

        // Get task details
        const taskResult = await client.query(
            `SELECT *
             FROM tasks
             WHERE id = $1`,
            [comment.task_id]
        );

        const task = taskResult.rows[0];

        // Delete comment
        await client.query(
            `DELETE FROM comments
             WHERE id = $1`,
            [commentId]
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
                "COMMENT_DELETED",
                `Deleted a comment from task "${task.title}"`,
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


module.exports = { createComment, getTaskComments, updateComment, deleteComment };