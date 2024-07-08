//src/components/EmployeeDataPage.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../styles/EmployeeDataPage.css";
import { ReactComponent as HomeIcon } from "../styles/home-icon.svg";
import { ReactComponent as ExitIcon } from "../styles/door-check-out-icon.svg";
import Viewcompensation from "./Viewcompensation";
import TimeEntryWeekly from "./TimeEntryWeekly";
import ViewProjects from "./Viewprojects";
import companyLogo from "../styles/Picture1.png";
import PrivilegedTab from "../components/privelegeuser";

const EmployeeDataPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, emailId } = location.state;
  const [employeeData, setEmployeeData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isPrivileged, setIsPrivileged] = useState(false);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/employeeData/${emailId}`
        );
        const data = await response.json();
        setEmployeeData(data);

        if (data.photo_data) {
          const photoResponse = await fetch(
            `http://localhost:5000/api/getPhoto/${emailId}`
          );
          const photoBlob = await photoResponse.blob();
          const photoUrl = URL.createObjectURL(photoBlob);
          setPhoto(photoUrl);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [emailId]);

  const handleExit = () => {
    navigate("/login");
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoFile(file);
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
          const photoResponse = await fetch(
            `http://localhost:5000/api/getPhoto/${emailId}`
          );
          const photoBlob = await photoResponse.blob();
          const photoUrl = URL.createObjectURL(photoBlob);
          setPhoto(photoUrl);
          alert("Photo uploaded successfully!");
        } else {
          const errorData = await response.json();
          alert(`Failed to upload photo: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
        alert("Failed to upload photo.");
      }
    }
  };

  const handleSave = async () => {
    const dataToSend = {};

    // Add edited fields to dataToSend
    Object.keys(editedData).forEach((key) => {
      if (editedData[key] !== employeeData[key]) {
        dataToSend[key] = editedData[key];
      }
    });

    // Send only if there's something to update
    if (Object.keys(dataToSend).length > 0) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/updateEmployeeData/${emailId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        );

        if (response.ok) {
          alert("Data saved successfully!");
        } else {
          const errorData = await response.json();
          alert(`Failed to save data: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Failed to save data.");
      }
    } else {
      alert("No changes to save.");
    }
  };

  const handleCancel = () => {
    setEditedData({});
    setPhoto(null);
    setPhotoFile(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedData({ ...editedData, [name]: value });
  };

  return (
    <div className="employee-data-page">
      <div className="header">
        <div className="icons-container">
          <HomeIcon className="icon" />
          <ExitIcon className="icon" onClick={handleExit} />
        </div>
        {userRole === "P" && (
          <button
            className="admin-button"
            onClick={() => setIsPrivileged(!isPrivileged)}
          >
            {isPrivileged ? "Normal User" : "Privileged User"}
          </button>
        )}
      </div>
      {isPrivileged ? (
        <PrivilegedTab />
      ) : (
        <div className="tabs-photo-container">
          <Tabs className="tabs-container">
            <TabList>
              <Tab>Employee Data</Tab>
              <Tab>View Compensation</Tab>
              <Tab>View Benefits</Tab>
              <Tab>Time Entry (weekly)</Tab>
              <Tab>View Projects</Tab>
              <Tab>View Payslips</Tab>
              <Tab>View Tax Summary</Tab>
            </TabList>

            <TabPanel>
              <h2 className="employee-data-title">View Employee Data</h2>

              <div className="employee-data">
                <div className="table-container">
                  <table className="employee-details-table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Employee Name:</strong>
                        </td>
                        <td>
                          {editedData.employee_name ||
                            employeeData.employee_name}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Employment Type:</strong>
                        </td>
                        <td>
                          {editedData.employment_type ||
                            employeeData.employment_type}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Contact Number:</strong>
                        </td>
                        <td>
                          {editedData.contact_number ||
                            employeeData.contact_number}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Job Location:</strong>
                        </td>
                        <td>
                          {editedData.job_location || employeeData.job_location}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="table-container">
                  <table className="employee-details-table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Employee ID:</strong>
                        </td>
                        <td>{employeeData.employee_id}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Job Title:</strong>
                        </td>
                        <td>{employeeData.job_title}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Date of Joining:</strong>
                        </td>
                        <td>{employeeData.doj}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="table-container">
                  <table className="employee-details-table address-table">
                    <thead>
                      <tr>
                        <th>Address:</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="address_line1"
                            placeholder="Address Line 1"
                            value={
                              editedData.address_line1 ||
                              employeeData.address_line1
                            }
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="address_line2"
                            placeholder="Address Line 2"
                            value={
                              editedData.address_line2 ||
                              employeeData.address_line2
                            }
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={editedData.city || employeeData.city}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="pin"
                            placeholder="PIN"
                            value={
                              editedData.pin !== undefined
                                ? editedData.pin
                                : employeeData.pin || ""
                            }
                            onChange={(e) => {
                              const input = e.target.value;
                              // Ensure input only contains numbers and has a maximum length of 6
                              if (/^\d{0,6}$/.test(input)) {
                                handleInputChange(e);
                              }
                            }}
                            onKeyPress={(e) => {
                              // Only allow numbers (keyCode 48-57) or backspace (keyCode 8)
                              if (
                                e.key === "Backspace" ||
                                (e.key >= "0" && e.key <= "9")
                              ) {
                                // Ensure total length is less than or equal to 6
                                if ((e.target.value + e.key).length > 6) {
                                  e.preventDefault();
                                }
                              } else {
                                e.preventDefault();
                              }
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="photo-container">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Employee"
                      className="employee-photo"
                    />
                  ) : (
                    <label htmlFor="photo-upload" className="upload-label">
                      Click to upload image
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="button-container">
                <button className="save-button" onClick={handleSave}>
                  Submit
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </TabPanel>

            {/* Example TabPanel for Compensation */}
            <TabPanel>
              <Viewcompensation
                employeeId={employeeData.employee_id}
                dateOfJoining={employeeData.doj}
                employeeName={employeeData.employee_name}
                employeeType={employeeData.employment_type}
              />
            </TabPanel>

            {/* Example TabPanel for Benefits */}
            <TabPanel>
              <h2>View Benefits</h2>
              <p>Benefits details go here...</p>
            </TabPanel>

            {/* Example TabPanel for Time Entry (weekly) */}
            <TabPanel>
              <TimeEntryWeekly
                employeeName={employeeData.employee_name}
                employeeId={employeeData.employee_id}
              />
            </TabPanel>

            {/* Example TabPanel for Projects */}
            <TabPanel>
              <ViewProjects
                employeeName={employeeData.employee_name}
                employeeId={employeeData.employee_id}
              />
            </TabPanel>

            {/* Example TabPanel for Payslips */}
            <TabPanel>
              <h2>View Payslips</h2>
              <p>Payslip details go here...</p>
            </TabPanel>

            {/* Example TabPanel for Tax Summary */}
            <TabPanel>
              <h2>View Tax Summary</h2>
              <p>Tax summary details go here...</p>
            </TabPanel>
          </Tabs>
        </div>
      )}
      <div className="logo-container2">
        <img src={companyLogo} alt="Company Logo" className="company-logo2" />
      </div>
    </div>
  );
};

export default EmployeeDataPage;
