-- user_table
CREATE TABLE User_table (
    Email_id VARCHAR(255) PRIMARY KEY,
    User_Name VARCHAR(255) NOT NULL,
    User_Role VARCHAR(50) NOT NULL
);

-- Employee_data
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

-- View_comp
CREATE TABLE View_comp (
    Employee_Id VARCHAR (15),
    Financial_year VARCHAR(10) NOT NULL,
    Base_pay_mv DECIMAL(10, 2) NOT NULL,
    Base_pay_yv DECIMAL(10, 2) NOT NULL,
    Allowance1 VARCHAR(255),
    A1_mv DECIMAL(10, 2) NOT NULL,
    A1_yv DECIMAL(10, 2) NOT NULL,
    Allowance2 VARCHAR(255),
    A2_mv DECIMAL(10, 2) NOT NULL,
    A2_yv DECIMAL(10, 2) NOT NULL,
    Allowance3 VARCHAR(255),
    A3_mv DECIMAL(10, 2) NOT NULL,
    A3_yv DECIMAL(10, 2) NOT NULL,
    CCPF_mv DECIMAL(10, 2) NOT NULL,
    CCPF_yv DECIMAL(10, 2) NOT NULL,
    Performance_bonus DECIMAL(10, 2) NOT NULL,
    TCTC DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (Employee_Id, Financial_year)
);

-- Approver_table
CREATE TABLE Approver_table (
    Employee_Id VARCHAR(20) REFERENCES Employee_data(Employee_Id),
    Approver_emp_id VARCHAR(255) NOT NULL,
    Approver_email_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (Employee_Id, Approver_emp_id)
);

-- Week_table
CREATE TABLE Week_table (
    Financial_Year VARCHAR(10) NOT NULL,
    Week_No INT NOT NULL,
    Wk_start_date DATE NOT NULL,
    Wk_end_date DATE NOT NULL,
    PRIMARY KEY (Financial_Year, Week_No)
);

-- Holiday_table
CREATE TABLE Holiday_table (
    Date DATE PRIMARY KEY,
    Holiday_desc VARCHAR(255) NOT NULL
);

-- Leave_Table
CREATE TABLE Leave_Table (
    Leave_code VARCHAR(10) PRIMARY KEY,
    Leave_desc VARCHAR(255) NOT NULL,
    Eligible_days INT NOT NULL
);

-- Employee_Leave_bal
CREATE TABLE Employee_Leave_bal (
    Employee_Id VARCHAR(20) REFERENCES Employee_data(Employee_Id),
    Financial_year VARCHAR(10) NOT NULL,
    Leave_code VARCHAR(10) REFERENCES Leave_Table(Leave_code),
    Opening_bal INT NOT NULL,
    Availed_this_year INT NOT NULL,
    Closing_bal INT NOT NULL,
    PRIMARY KEY (Employee_Id, Financial_year, Leave_code)
);

-- Employee_projects
CREATE TABLE Employee_projects (
    Employee_Id VARCHAR(20) REFERENCES Employee_data(Employee_Id),
    Project_id VARCHAR(255) NOT NULL,
    Budgeted_hours VARCHAR(255) NOT NULL,
    Clocked_hours VARCHAR(255) NOT NULL,
    PRIMARY KEY (Employee_Id, Project_id)
);

-- Employee_time_entry
CREATE TABLE Employee_time_entry (
    Employee_Id VARCHAR(20) REFERENCES Employee_data(Employee_Id),
    Financial_year VARCHAR(10) NOT NULL,
    Date DATE NOT NULL,
    Day_of_week VARCHAR(10) NOT NULL,
    Type_1 VARCHAR(50),
    Type_2 VARCHAR(50),
    Clocked_hrs DECIMAL(10, 2) NOT NULL,
    Approval_status VARCHAR(50),
    PRIMARY KEY (Employee_Id, Financial_year, Date)
);


