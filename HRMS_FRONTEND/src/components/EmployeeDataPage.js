import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../styles/EmployeeDataPage.css";
import { ReactComponent as HomeIcon } from "../styles/home-icon.svg";
import { ReactComponent as ExitIcon } from "../styles/door-check-out-icon.svg";

const EmployeeDataPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, emailId } = location.state;
  const [employeeData, setEmployeeData] = useState({});
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/employeeData/${emailId}`
        );
        const data = await response.json();
        setEmployeeData(data);
        setPhoto(data.photo_data); // Assuming photo_data is fetched from the API
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [emailId]);

  const handleExit = () => {
    navigate("/login");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 200000) {
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const response = await fetch(
          `http://localhost:5000/api/uploadPhoto/${emailId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const result = await response.json();
          setPhoto(result.photo_data); // Update photo_data if the API returns it
          alert("Image uploaded successfully");
        } else {
          alert("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
      }
    } else {
      alert("Please upload an image file less than 200KB");
    }
  };

  return (
    <div className="employee-data-page">
      <div className="header">
        <HomeIcon className="icon" />
        <ExitIcon className="icon" onClick={handleExit} />
        <span className="user-role">
          {userRole === "P" ? "Admin user" : "Normal user"}
        </span>
      </div>
      <div className="tabs-photo-container">
        <Tabs className="tabs-container">
          <TabList>
            <Tab>Employee Data</Tab>
            <Tab>View Compensation</Tab>
            <Tab>View Benefits</Tab>
            <Tab>Time Entry (weekly)</Tab>
            <Tab>Time Entry (monthly)</Tab>
            <Tab>View Projects</Tab>
            <Tab>Leave</Tab>
            <Tab>View Payslips</Tab>
            <Tab>View Tax Summary</Tab>
            <Tab>Admin</Tab>
          </TabList>

          <TabPanel>
            <h2>Employee Data</h2>
            <div className="employee-data">
              <div className="details-container">
                <p>
                  <strong>Employee Name:</strong> {employeeData.employee_name}
                </p>
                <p>
                  <strong>Email ID:</strong> {employeeData.email_id}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {employeeData.dob}
                </p>
                <p>
                  <strong>Date of Joining:</strong> {employeeData.doj}
                </p>
                <p>
                  <strong>Employment Type:</strong>{" "}
                  {employeeData.employment_type}
                </p>
                <p>
                  <strong>Job Title:</strong> {employeeData.job_title}
                </p>
                <p>
                  <strong>Contact Number:</strong> {employeeData.contact_number}
                </p>
                <p>
                  <strong>Address Line 1:</strong> {employeeData.address_line1}
                </p>
                <p>
                  <strong>Address Line 2:</strong> {employeeData.address_line2}
                </p>
                <p>
                  <strong>City:</strong> {employeeData.city}
                </p>
                <p>
                  <strong>Pin:</strong> {employeeData.pin}
                </p>
                <p>
                  <strong>Office Location:</strong> {employeeData.job_location}
                </p>
              </div>
              <div className="photo-container">
                {photo ? (
                  <img
                    src={`data:image/jpeg;base64,${photo}`}
                    alt="Employee"
                    className="employee-photo"
                  />
                ) : (
                  <p>No photo uploaded</p>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handlePhotoUpload}
                />
                <button onClick={handlePhotoUpload}>Upload</button>
              </div>
            </div>
          </TabPanel>

          {/* Example TabPanel for Compensation */}
          <TabPanel>
            <h2>View Compensation</h2>
            <p>Compensation details go here...</p>
          </TabPanel>

          {/* Example TabPanel for Benefits */}
          <TabPanel>
            <h2>View Benefits</h2>
            <p>Benefits details go here...</p>
          </TabPanel>

          {/* Example TabPanel for Time Entry (weekly) */}
          <TabPanel>
            <h2>Time Entry (weekly)</h2>
            <p>Weekly time entry details go here...</p>
          </TabPanel>

          {/* Example TabPanel for Time Entry (monthly) */}
          <TabPanel>
            <h2>Time Entry (monthly)</h2>
            <p>Monthly time entry details go here...</p>
          </TabPanel>

          {/* Example TabPanel for View Projects */}
          <TabPanel>
            <h2>View Projects</h2>
            <p>Projects details go here...</p>
          </TabPanel>

          {/* Example TabPanel for Leave */}
          <TabPanel>
            <h2>Leave</h2>
            <p>Leave details go here...</p>
          </TabPanel>

          {/* Example TabPanel for View Payslips */}
          <TabPanel>
            <h2>View Payslips</h2>
            <p>Payslips details go here...</p>
          </TabPanel>

          {/* Example TabPanel for View Tax Summary */}
          <TabPanel>
            <h2>View Tax Summary</h2>
            <p>Tax summary details go here...</p>
          </TabPanel>

          {/* Example TabPanel for Admin */}
          <TabPanel>
            <h2>Admin</h2>
            <p>Admin panel details go here...</p>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDataPage;
