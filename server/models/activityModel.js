const pool = require('../config/db')


const getProjectActivity = async (
    projectId,
    userId
) => {

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

    // Check membership
    const memberResult = await pool.query(
        `SELECT *
         FROM project_members
         WHERE project_id = $1
         AND user_id = $2`,
        [
            projectId,
            userId
        ]
    );

    const member = memberResult.rows[0];

    if (!member) {
        throw new Error("Access denied");
    }

    // Get activity logs
   const activitiesResult = await pool.query(
    `SELECT
        activity_logs.*,
        users.name AS user_name
     FROM activity_logs
     JOIN users
     ON activity_logs.user_id = users.id
     WHERE activity_logs.project_id = $1
     ORDER BY activity_logs.created_at DESC`,
    [projectId]
);

return activitiesResult.rows;

};


module.exports = {getProjectActivity}