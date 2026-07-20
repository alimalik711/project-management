
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


const deleteTask = async (taskId, userId) => {

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

        // Delete task
        await client.query(
            `DELETE FROM tasks
             WHERE id = $1`,
            [taskId]
        );

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
                `Task "${task.title}" was deleted`,
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




const assignTask = async (taskId, requesterId, assigneeId) => {

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

        // Check requester is project member
        const memberResult = await client.query(
            `SELECT *
             FROM project_members
             WHERE project_id = $1
             AND user_id = $2`,
            [task.project_id, requesterId]
        );

        const member = memberResult.rows[0];

        if (!member) {
            throw new Error("Access denied");
        }

        // Check assignee exists
        const userResult = await client.query(
            `SELECT *
             FROM users
             WHERE id = $1`,
            [assigneeId]
        );

        const user = userResult.rows[0];

        if (!user) {
            throw new Error("User not found");
        }

        // Check assignee is project member
        const assigneeMemberResult = await client.query(
            `SELECT *
             FROM project_members
             WHERE project_id = $1
             AND user_id = $2`,
            [task.project_id, assigneeId]
        );

        const assigneeMember = assigneeMemberResult.rows[0];

        if (!assigneeMember) {
            throw new Error("User is not a member of this project");
        }

        // Check already assigned
        const assignedResult = await client.query(
            `SELECT *
             FROM task_assignees
             WHERE task_id = $1
             AND user_id = $2`,
            [taskId, assigneeId]
        );

        const assigned = assignedResult.rows[0];

        if (assigned) {
            throw new Error("User is already assigned to this task");
        }

        // Assign task
        await client.query(
            `INSERT INTO task_assignees
            (
                task_id,
                user_id
            )
            VALUES ($1, $2)`,
            [
                taskId,
                assigneeId
            ]
        );

        // Create notification
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
                assigneeId,
                "TASK_ASSIGNED",
                `You have been assigned to task "${task.title}"`,
                task.id,
                task.project_id
            ]
        );

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
                requesterId,
                "TASK_ASSIGNED",
                `Assigned "${user.name}" to task "${task.title}"`,
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



const changeTaskStatus = async (taskId, userId, status) => {

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

        // Update status
        const updatedTaskResult = await client.query(
            `UPDATE tasks
             SET status = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [
                status,
                taskId
            ]
        );

        const updatedTask = updatedTaskResult.rows[0];

        // Get all task assignees
        const assigneesResult = await client.query(
            `SELECT user_id
             FROM task_assignees
             WHERE task_id = $1`,
            [taskId]
        );

        // Create notifications
        for (const assignee of assigneesResult.rows) {

            if (assignee.user_id !== userId) {

                await client.query(
                    `INSERT INTO notifications
                    (
                        user_id,
                        message,
                        task_id
                    )
                    VALUES ($1, $2, $3)`,
                    [
                        assignee.user_id,
                        `Task "${task.title}" status changed to "${status}".`,
                        task.id
                    ]
                );

            }

        }

        // Activity Log
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
                "TASK_STATUS_CHANGED",
                `Changed task "${task.title}" status to "${status}"`,
                task.project_id,
                task.id
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
    createTask,getProjectTasks,getTaskById,updateTask,deleteTask,assignTask,changeTaskStatus
};