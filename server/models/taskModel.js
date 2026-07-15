
const pool = require('../config/db');


const createTask = async (
    projectId,
    userId,
    title,
    description,
    priority,
    dueDate
) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Check project exists
        const projectResult = await client.query(
            `SELECT *
             FROM projects
             WHERE id = $1`,
            [projectId]
        );

        const project = projectResult.rows[0];

        if (!project) {
            throw new Error("Project not found");
        }

        // Check user is a project member
        const memberResult = await client.query(
            `SELECT *
             FROM project_members
             WHERE project_id = $1
             AND user_id = $2`,
            [projectId, userId]
        );

        const member = memberResult.rows[0];

        if (!member) {
            throw new Error("You are not a member of this project");
        }

        // Create task
        const taskResult = await client.query(
            `INSERT INTO tasks
            (
                title,
                description,
                due_date,
                priority,
                project_id,
                created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                title,
                description,
                dueDate,
                priority,
                projectId,
                userId
            ]
        );

        const task = taskResult.rows[0];

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
                "TASK_CREATED",
                `Task "${task.title}" was created`,
                projectId,
                task.id
            ]
        );

        await client.query("COMMIT");

        return task;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }
};



const getProjectTasks = async (projectId, userId) => {

    try {

        // Check project exists
        const projectResult = await pool.query(
            `SELECT *
             FROM projects
             WHERE id = $1`,
            [projectId]
        );

        const project = projectResult.rows[0];

        if (!project) {
            throw new Error("Project not found");
        }

        // Check user is a project member
        const memberResult = await pool.query(
            `SELECT *
             FROM project_members
             WHERE project_id = $1
             AND user_id = $2`,
            [projectId, userId]
        );

        const member = memberResult.rows[0];

        if (!member) {
            throw new Error("Access denied");
        }

        // Get all tasks
        const taskResult = await pool.query(
            `SELECT *
             FROM tasks
             WHERE project_id = $1
             ORDER BY created_at DESC`,
            [projectId]
        );

        return taskResult.rows;

    } catch (error) {

        throw error;

    }

};


const getTaskById = async (taskId, userId) => {

    try {

        // Check task exists
        const taskResult = await pool.query(
            `SELECT
                t.*,
                u.name AS creator_name
             FROM tasks t
             JOIN users u
             ON t.created_by = u.id
             WHERE t.id = $1`,
            [taskId]
        );

        const task = taskResult.rows[0];

        if (!task) {
            throw new Error("Task not found");
        }

        // Check user is a project member
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

        return task;

    } catch (error) {

        throw error;

    }

};


const updateTask = async (taskId, userId, data) => {

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

        // Check user is a project member
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

        // Get updated values
        const {
            title,
            description,
            priority,
            status,
            due_date
        } = data;

        const updatedTitle = title ?? task.title;
        const updatedDescription = description ?? task.description;
        const updatedPriority = priority ?? task.priority;
        const updatedStatus = status ?? task.status;
        const updatedDueDate = due_date ?? task.due_date;

        // Update task
        const updatedTaskResult = await client.query(
            `UPDATE tasks
             SET
                title = $1,
                description = $2,
                priority = $3,
                status = $4,
                due_date = $5,
                updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [
                updatedTitle,
                updatedDescription,
                updatedPriority,
                updatedStatus,
                updatedDueDate,
                taskId
            ]
        );

        const updatedTask = updatedTaskResult.rows[0];

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
                "TASK_UPDATED",
                `Task "${updatedTask.title}" was updated`,
                updatedTask.project_id,
                updatedTask.id
            ]
        );

        await client.query("COMMIT");

        return updatedTask;

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }

};

module.exports = {
    createTask
};