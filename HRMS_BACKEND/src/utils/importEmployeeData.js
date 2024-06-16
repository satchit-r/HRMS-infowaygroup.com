// src/utils/importEmployeeData.js
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

async function importEmployeeData(filePath) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Begin a transaction
    const workbook = xlsx.readFile(filePath);
    const sheetName = "Employee_data";
    const worksheet = workbook.Sheets[sheetName];
    const employeeData = xlsx.utils.sheet_to_json(worksheet);

    for (let row of employeeData) {
      const employeeId = row.Employee_Id ? row.Employee_Id.toString() : null;

      // Check for null or invalid Employee_Id
      if (!employeeId || employeeId.trim() === "") {
        console.log(
          `Skipping row with invalid Employee_Id: ${JSON.stringify(row)}`
        );
        continue;
      }

      const insertQuery = `
        INSERT INTO Employee_data (
          Employee_Id, Employee_Name, Email_id, DOB, DOJ, Employment_type,
          JOB_Title, Contact_number, Address_line1, Address_line2, City, Pin, Job_Location
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (Employee_Id) DO NOTHING;  -- Ignore duplicate Employee_Id
      `;

      const values = [
        employeeId,
        row.Employee_Name,
        row.Email_id,
        new Date(row.DOB),
        new Date(row.DOJ),
        row.Employment_type,
        row.JOB_Title,
        row.Contact_number,
        row.Address_line1,
        row.Address_line2,
        row.City,
        row.Pin,
        row.Job_Location,
      ];

      // Execute each insert query separately
      try {
        await client.query(insertQuery, values);
      } catch (error) {
        console.error(`Error inserting row: ${JSON.stringify(row)}\n`, error);
      }
    }

    await client.query("COMMIT"); // Commit the transaction
    console.log("Employee_data import completed");
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback the transaction on error
    throw error;
  } finally {
    client.release(); // Release the client back to the pool
  }
}

module.exports = importEmployeeData;
