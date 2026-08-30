const pool = require('../config/db');





const createProject = async (name, description, deadline, ownerId)=>

{

    const client = await pool.connect();
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
  try {
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
  } catch (error) {
    throw error;
  }
};


const getProjectById = async (projectId, userId) => {
    try {
        const result = await pool.query(
            `SELECT p.*, pm.role
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
                
                 updated_at = NOW()
             WHERE id = $4
             AND owner_id = $5
             RETURNING *`,
            [name, description, deadline, projectId, userId]
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








const addMember = async (projectId, ownerId, email) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Find user
        const userResult = await client.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        const user = userResult.rows[0];

        if (!user) {
            throw new Error("User not found");
        }

        // Find project
        const projectResult = await client.query(
            `SELECT * FROM projects WHERE id = $1`,
            [projectId]
        );

        const project = projectResult.rows[0];

        if (!project) {
            throw new Error("Project not found");
        }

        // Check owner
        if (project.owner_id !== ownerId) {
            throw new Error("Only the project owner can add members");
        }

        // Check existing member
        const memberResult = await client.query(
            `SELECT *
             FROM project_members
             WHERE project_id = $1
             AND user_id = $2`,
            [projectId, user.id]
        );

        if (memberResult.rows[0]) {
            throw new Error("User is already a project member");
        }

        // Add member
        await client.query(
            `INSERT INTO project_members (project_id, user_id, role)
             VALUES ($1, $2, 'MEMBER')`,
            [projectId, user.id]
        );

        // Notification
        await client.query(
            `INSERT INTO notifications
            (user_id, type, message, project_id)
            VALUES ($1, $2, $3, $4)`,
            [
                user.id,
                "PROJECT_INVITATION",
                `You have been added to project "${project.name}"`,
                projectId
            ]
        );

        // Activity log
        await client.query(
            `INSERT INTO activity_logs
            (user_id, action, description, project_id)
            VALUES ($1, $2, $3, $4)`,
            [
                ownerId,
                "PROJECT_UPDATED",
                `${user.name} was added to the project`,
                projectId
            ]
        );

        await client.query("COMMIT");

        return {
            message: "Member added successfully"
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};



const getProjectMembers = async (projectId, userId) => {
    try {

        // Check requester is a member
        const memberResult = await pool.query(
            `SELECT *
             FROM project_members
             WHERE project_id = $1
             AND user_id = $2`,
            [projectId, userId]
        );

        if (!memberResult.rows[0]) {
            throw new Error("Access denied");
        }

        // Get all members
        const result = await pool.query(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.avatar,
                pm.role,
                pm.joined_at
             FROM project_members pm
             JOIN users u
             ON pm.user_id = u.id
             WHERE pm.project_id = $1
             ORDER BY pm.joined_at`,
            [projectId]
        );

        return result.rows;

    } catch (error) {
        throw error;
    }
};



const removeMember = async (projectId, ownerId, userId) => {
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

        // Check requester is owner
        if (project.owner_id !== ownerId) {
            throw new Error("Only the project owner can remove members");
        }

        // Check target user is a member (and get their name)
        const memberResult = await client.query(
            `SELECT
                pm.*,
                u.name
             FROM project_members pm
             JOIN users u
             ON pm.user_id = u.id
             WHERE pm.project_id = $1
             AND pm.user_id = $2`,
            [projectId, userId]
        );

        const member = memberResult.rows[0];

        if (!member) {
            throw new Error("User is not a project member");
        }

        // Prevent removing owner
        if (member.role === "OWNER") {
            throw new Error("Project owner cannot be removed");
        }

        // Remove member
        await client.query(
            `DELETE FROM project_members
             WHERE project_id = $1
             AND user_id = $2`,
            [projectId, userId]
        );

        // Create notification
        await client.query(
            `INSERT INTO notifications
            (user_id, type, message, project_id)
            VALUES ($1, $2, $3, $4)`,
            [
                userId,
                "PROJECT_MEMBER_REMOVED",
                `You have been removed from project "${project.name}"`,
                projectId
            ]
        );

        // Create activity log
        await client.query(
            `INSERT INTO activity_logs
            (user_id, action, description, project_id)
            VALUES ($1, $2, $3, $4)`,
            [
                ownerId,
                "PROJECT_MEMBER_REMOVED",
                `${member.name} was removed from the project`,
                projectId
            ]
        );

        await client.query("COMMIT");

        return {
            message: "Member removed successfully"
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }



};


const deleteProject = async (projectId, userId) => {
    const result = await pool.query(
        `
        DELETE FROM projects
        WHERE id = $1
        AND owner_id = $2
        RETURNING *
        `,
        [projectId, userId]
    );

    return result.rows[0];
};


module.exports = {
    createProject, getMyProjects, getProjectById, updateProject, archiveProject, addMember, getProjectMembers, removeMember, deleteProject
};