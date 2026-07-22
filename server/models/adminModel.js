const pool = require('../config/db')


const getAllUsers = async (
    page,
    limit,
    search,
    sortBy,
    order
) => {

    const offset = (page - 1) * limit;

    const allowedSortFields = [
        "name",
        "email",
        "created_at",
        "role"
    ];

    if (!allowedSortFields.includes(sortBy)) {
        sortBy = "created_at";
    }

    order = order.toUpperCase();

    if (order !== "ASC" && order !== "DESC") {
        order = "DESC";
    }

    const usersResult = await pool.query(
        `SELECT
            id,
            name,
            email,
            role,
            is_blocked,
            created_at
         FROM users
         WHERE
            name ILIKE $1
            OR email ILIKE $1
         ORDER BY ${sortBy} ${order}
         LIMIT $2
         OFFSET $3`,
        [
            `%${search}%`,
            limit,
            offset
        ]
    );

    return usersResult.rows;

};



const blockUser = async (userId) => {

    const result = await pool.query(
        `UPDATE users
         SET is_blocked = TRUE
         WHERE id = $1
         AND is_blocked = FALSE
         RETURNING
            id,
            name,
            email,
            role,
            is_blocked`,
        [userId]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error("User not found or already blocked");
    }

    return user;

};


const unblockUser = async (userId) => {

    const result = await pool.query(
        `UPDATE users
         SET is_blocked = FALSE
         WHERE id = $1
         AND is_blocked = TRUE
         RETURNING
            id,
            name,
            email,
            role,
            is_blocked`,
        [userId]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error("User not found or already unblocked");
    }

    return user;

};


const deleteUser = async (userId) => {

    const userResult = await pool.query(
        `SELECT *
         FROM users
         WHERE id = $1`,
        [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
        throw new Error("User not found");
    }


    const projectResult = await pool.query(
        `SELECT id
         FROM projects
         WHERE owner_id = $1`,
        [userId]
    );


    if (projectResult.rows.length > 0) {
        throw new Error(
            "Cannot delete user who owns projects"
        );
    }


    const deletedUser = await pool.query(
        `DELETE FROM users
         WHERE id = $1
         RETURNING
            id,
            name,
            email,
            role`,
        [userId]
    );


    return deletedUser.rows[0];

};




const getAllProjects = async (
    page,
    limit,
    search,
    sortBy,
    order
) => {

    const offset = (page - 1) * limit;

    const allowedSortFields = [
        "title",
        "status",
        "created_at"
    ];

    if (!allowedSortFields.includes(sortBy)) {
        sortBy = "created_at";
    }

    order = order.toUpperCase();

    if (order !== "ASC" && order !== "DESC") {
        order = "DESC";
    }

    const result = await pool.query(
        `SELECT
            projects.id,
            projects.title,
            projects.description,
            projects.status,
            projects.created_at,
            users.id AS owner_id,
            users.name AS owner_name,
            users.email AS owner_email
         FROM projects
         JOIN users
            ON projects.owner_id = users.id
         WHERE
            projects.title ILIKE $1
            OR users.name ILIKE $1
         ORDER BY ${sortBy} ${order}
         LIMIT $2
         OFFSET $3`,
        [
            `%${search}%`,
            limit,
            offset
        ]
    );

    return result.rows;

};




module.exports = {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getAllProjects
};





