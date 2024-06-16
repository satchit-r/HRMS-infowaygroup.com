//src/services/userService.js
const pool = require("../utils/db");
const User = require("../models/User");

const createUser = async (user) => {
  const { email, password, name, role } = user;
  try {
    const query =
      "INSERT INTO user_table (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(query, [email, password, name, role]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

module.exports = {
  createUser,
};
