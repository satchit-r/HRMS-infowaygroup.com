const pool = require("../utils/db");

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password presence
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Validate email format
  if (!email.endsWith("@infowaygroup.com")) {
    return res.status(401).json({ message: "Invalid email address" });
  }

  try {
    const query = "SELECT * FROM User_table WHERE Email_id = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Validate password
    if (password !== "User@1234") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successful login
    res
      .status(200)
      .json({ message: "Login successful", userRole: user.user_role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { login };
