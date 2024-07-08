import React, { useState, useEffect } from "react";
import "../styles/Viewprojects.css";

const ViewProjects = ({ employeeName, employeeId }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects(employeeId);
  }, [employeeId]);

  const fetchProjects = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/timeEntry/employee_projects/${employeeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      // Handle error as needed
    }
  };

  return (
    <div className="tab-content">
      <h1>View Assigned Projects</h1>
      <div className="tab-header">
        <div className="info-section">
          <div className="info-label">Employee ID:</div>
          <div className="info-value">{employeeId}</div>
        </div>
        <div className="info-section">
          <div className="info-label">Employee Name:</div>
          <div className="info-value">{employeeName}</div>
        </div>
      </div>
      <table className="project-table">
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Description</th>
            <th>Planned Hours</th>
            <th>Clock Hours</th>
            <th>Utilization</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.project_id}</td>
              <td>{project.description}</td>{" "}
              {/* Replace with actual description field */}
              <td>{project.budgeted_hours || "--"}</td>
              <td>{project.clocked_hours || "--"}</td>
              <td>{project.utilization || "--"}</td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan="5">No projects found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewProjects;
