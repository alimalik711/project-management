const pool = require("../config/db");

const getDashboardStats = async (userId) => {
    const result = await pool.query(
        `
        SELECT

        (
            SELECT COUNT(*)::INT
            FROM project_members
            WHERE user_id = $1
        ) AS total_projects,

        (
            SELECT COUNT(*)::INT
            FROM task_assignees
            WHERE user_id = $1
        ) AS assigned_tasks,

        (
            SELECT COUNT(*)::INT
            FROM tasks t
            JOIN task_assignees ta
                ON ta.task_id = t.id
            WHERE ta.user_id = $1
            AND t.status = 'COMPLETED'
        ) AS completed_tasks,

        (
            SELECT COUNT(*)::INT
            FROM tasks t
            JOIN task_assignees ta
                ON ta.task_id = t.id
            WHERE ta.user_id = $1
            AND t.status <> 'COMPLETED'
        ) AS pending_tasks,

        (
            SELECT COUNT(*)::INT
            FROM tasks t
            JOIN task_assignees ta
                ON ta.task_id = t.id
            WHERE ta.user_id = $1
            AND t.due_date < CURRENT_DATE
            AND t.status <> 'COMPLETED'
        ) AS overdue_tasks,

        (
            SELECT COUNT(*)::INT
            FROM notifications
            WHERE user_id = $1
            AND is_read = FALSE
        ) AS unread_notifications
        `,
        [userId]
    );

    return result.rows[0];
};

module.exports = {
    getDashboardStats
};