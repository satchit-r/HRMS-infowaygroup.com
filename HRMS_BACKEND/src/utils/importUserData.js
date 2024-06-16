// src/utils/importUserData.js
const xlsx = require("xlsx");
const { Pool } = require("pg");
require("dotenv").config();

// Load environment variables
const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT } = process.env;

// Configure the PostgreSQL pool
const pool = new Pool({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database");
});

async function importUserData(filePath) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const workbook = xlsx.readFile(filePath);
    const sheetName = "User_table";
    const worksheet = workbook.Sheets[sheetName];
    const userTableData = xlsx.utils.sheet_to_json(worksheet);
    const insertQuery =
      "INSERT INTO User_table (Email_id, User_Name, User_Role) VALUES ($1, $2, $3) " +
      "ON CONFLICT (Email_id) DO UPDATE SET (User_Name, User_Role) = (EXCLUDED.User_Name, EXCLUDED.User_Role)";

    for (let row of userTableData) {
      const values = [row.Email_id, row.User_Name, row.User_Role];
      await client.query(insertQuery, values);
    }
    await client.query("COMMIT");
    console.log("User_table data import completed");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = importUserData;
