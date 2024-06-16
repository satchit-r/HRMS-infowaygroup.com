//src/models/User.js
// Not all columns are included for brevity, adjust as per your table structure
class User {
  constructor(email, password, name, role) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
  }
}

module.exports = User;
