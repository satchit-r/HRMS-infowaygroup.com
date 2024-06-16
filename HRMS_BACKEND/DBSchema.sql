CREATE TABLE User_table (
    Email_id VARCHAR(255) PRIMARY KEY,
    User_Name VARCHAR(255) NOT NULL,
    User_Role VARCHAR(50) NOT NULL
);

CREATE TABLE Employee_data (
    Employee_Id INT PRIMARY KEY,
    Employee_Name VARCHAR(255) NOT NULL,
    Email_id VARCHAR(255) REFERENCES User_table(Email_id),
    DOB DATE NOT NULL,
    DOJ DATE NOT NULL,
    Employment_type VARCHAR(50) NOT NULL,
    JOB_Title VARCHAR(255) NOT NULL,
    Contact_number VARCHAR(20) NOT NULL,
    Address_line1 VARCHAR(255) NOT NULL,
    Address_line2 VARCHAR(255),
    City VARCHAR(100) NOT NULL,
    Pin VARCHAR(20) NOT NULL,
    Job_Location VARCHAR(100) NOT NULL
);
