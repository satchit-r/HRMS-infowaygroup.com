//src/utils/db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
