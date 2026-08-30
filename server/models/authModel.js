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

module.exports = {
    getUserByEmail,
    createUser
};