const pool = require("../config/db");

const getDashboardStats = async (userId) => {

    const result = await pool.query(
        `
        SELECT

        (
            SELECT COUNT(*)
            FROM project_members
            WHERE user_id = $1
        ) AS total_projects,

        (
            SELECT COUNT(*)
            FROM tasks
            WHERE assigned_to = $1
        ) AS assigned_tasks,

        (
            SELECT COUNT(*)
            FROM tasks
            WHERE assigned_to = $1
            AND status = 'DONE'
        ) AS completed_tasks,

        (
            SELECT COUNT(*)
            FROM tasks
            WHERE assigned_to = $1
            AND status <> 'DONE'
        ) AS pending_tasks,

        (
            SELECT COUNT(*)
            FROM tasks
            WHERE assigned_to = $1
            AND due_date < CURRENT_DATE
            AND status <> 'DONE'
        ) AS overdue_tasks,

        (
            SELECT COUNT(*)
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