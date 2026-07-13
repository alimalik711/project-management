const pool = require('../config/db');




const client = await pool.connect();

const createProject = async (req,res)=>
{
try {
    await client.query("BEGIN");

    const result = await client.query(
    `INSERT INTO projects (name, description, deadline, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, deadline, ownerId]
);


    const project = result.rows[0];

    await client.query(
    `INSERT INTO project_members (project_id, user_id, role)
     VALUES ($1, $2, $3)`,
    [project.id, ownerId, "OWNER"]
);

    await client.query(
    `INSERT INTO activity_logs (user_id, action, description, project_id)
     VALUES ($1, $2, $3, $4)`,
    [
        ownerId,
        "PROJECT_CREATED",
        `Created project "${project.name}"`,
        project.id,
    ]
);




    await client.query("COMMIT");

    return project;

    
} catch (error) {
    await client.query("ROLLBACK");
    throw error;
} finally {
    client.release();
}

}



const getMyProjects = async (userId) => {
    const result = await pool.query(
        `SELECT p.*
         FROM projects p
         JOIN project_members pm
         ON p.id = pm.project_id
         WHERE pm.user_id = $1
         ORDER BY p.created_at DESC`,
        [userId]
    );

    return result.rows;
};



const getProjectById = async (projectId, userId) => {
    try {
        const result = await pool.query(
            `SELECT p.*
             FROM projects p
             JOIN project_members pm
             ON p.id = pm.project_id
             WHERE p.id = $1
             AND pm.user_id = $2`,
            [projectId, userId]
        );

        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const updateProject = async (
    projectId,
    userId,
    name,
    description,
    deadline,
    status
) => {
    try {
        const result = await pool.query(
            `UPDATE projects
             SET name = $1,
                 description = $2,
                 deadline = $3,
                 status = $4,
                 updated_at = NOW()
             WHERE id = $5
             AND owner_id = $6
             RETURNING *`,
            [name, description, deadline, status, projectId, userId]
        );

        return result.rows[0];
    } catch (error) {
        throw error;
    }
};


const archiveProject = async (projectId, userId) => {
    try {
        const result = await pool.query(
            `UPDATE projects
             SET status = 'ARCHIVED',
                 updated_at = NOW()
             WHERE id = $1
             AND owner_id = $2
             RETURNING *`,
            [projectId, userId]
        );

        return result.rows[0];
    } catch (error) {
        throw error;
    }
};







module.exports = {
    createProject, getMyProjects,getProjectById,updateProject,archiveProject
};