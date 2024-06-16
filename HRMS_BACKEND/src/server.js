const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const cors = require("cors");
const { login } = require("./controllers/authController");
const pool = require("./utils/db");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 200000 } });

// Route to handle login
app.post("/api/auth/login", login);

// Route to fetch user data based on email
app.get("/api/userData/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const query =
      "SELECT Email_id, User_role FROM User_table WHERE Email_id = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Route to fetch employee data based on email
app.get("/api/employeeData/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const query = "SELECT * FROM Employee_data WHERE Email_id = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee data not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ message: "Error fetching employee data" });
  }
});

// Route to handle photo upload for employees
app.post(
  "/api/uploadPhoto/:email",
  upload.single("photo"),
  async (req, res) => {
    const { email } = req.params;
    const photoData = req.file.buffer; // Access the uploaded file buffer

    try {
      if (!photoData) {
        return res.status(400).json({ message: "No photo data received" });
      }

      // Update the Employee_data table with the bytea format photo data
      const updateQuery =
        "UPDATE Employee_data SET Photo_data = $1 WHERE Email_id = $2";
      await pool.query(updateQuery, [photoData, email]);

      res.status(200).json({ message: "Photo uploaded successfully" });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: "Error uploading photo" });
    }
  }
);

// Route to fetch employee photo based on email
app.get("/api/getPhoto/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // Fetch the photo data (bytea format) from Employee_data table
    const query = "SELECT Photo_data FROM Employee_data WHERE Email_id = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0 || !result.rows[0].photo_data) {
      return res.status(404).json({ message: "Photo not found" });
    }

    const photoData = result.rows[0].photo_data;
    res.status(200).send(photoData);
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).json({ message: "Error fetching photo" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
