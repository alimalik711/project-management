const pool = require('../config/db');

const client = await pool.connect();


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