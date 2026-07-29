const pool = require("../config/db");

// Get user by email
const getUserByEmail = async (email) => {

    const result = await pool.query(
        `SELECT *
         FROM users
         WHERE email = $1`,
        [email]
    );

    return result.rows[0];

};

// Create user
const createUser = async (
    name,
    email,
    hashedPassword
) => {

    const result = await pool.query(
        `INSERT INTO users
        (
            name,
            email,
            password
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING *`,
        [
            name,
            email,
            hashedPassword
        ]
    );

    return result.rows[0];

};

// Get user by id
const getUserById = async (userId) => {

    const result = await pool.query(
        `SELECT *
         FROM users
         WHERE id = $1`,
        [userId]
    );

    return result.rows[0];

};

// Update profile
const updateUserProfile = async (
    userId,
    name
) => {

    const result = await pool.query(
        `UPDATE users
         SET name = $1
         WHERE id = $2
         RETURNING *`,
        [
            name,
            userId
        ]
    );

    return result.rows[0];

};

// Change password
const changeUserPassword = async (
    userId,
    hashedPassword
) => {

    const result = await pool.query(
        `UPDATE users
         SET password = $1
         WHERE id = $2
         RETURNING *`,
        [
            hashedPassword,
            userId
        ]
    );

    return result.rows[0];

};



const getAvatarByUserId = async (userId) => {
    const result = await pool.query(
        `
        SELECT avatar
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    return result.rows[0];
};

const updateUserAvatar = async (
    userId,
    avatarPath
) => {
    const result = await pool.query(
        `
        UPDATE users
        SET
            avatar = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING
            id,
            name,
            email,
            role,
            avatar,
            created_at,
            updated_at
        `,
        [avatarPath, userId]
    );

    return result.rows[0];
};



module.exports = {
    getUserByEmail,
    createUser,
    getUserById,
    updateUserProfile,
    changeUserPassword,
    getAvatarByUserId,
    updateUserAvatar
};