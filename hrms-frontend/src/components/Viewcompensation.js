// src/components/ViewCompensation.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Viewcompensation.css";

const ViewCompensation = ({
  employeeId,
  dateOfJoining,
  employeeName,
  employeeType,
}) => {
  const [compensationData, setCompensationData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompensationData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/viewComp/${employeeId}`
        );
        setCompensationData(response.data[0]); // Assuming API returns an array with one object
        setLoading(false);
      } catch (error) {
        console.error("Error fetching compensation data:", error);
        setLoading(false);
      }
    };

    fetchCompensationData();
  }, [employeeId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Function to dynamically render allowance rows
  const renderAllowanceRows = () => {
    const allowances = [];

    // Loop through all allowances in compensationData
    for (let i = 1; i <= 3; i++) {
      const allowanceKey = `allowance${i}`;
      const mvKey = `a${i}_mv`;
      const yvKey = `a${i}_yv`;

      if (compensationData[allowanceKey]) {
        allowances.push(
          <tr key={i}>
            <td>{compensationData[allowanceKey]}</td>
            <td style={{ textAlign: "right" }}>{compensationData[mvKey]}</td>
            <td style={{ textAlign: "right" }}>{compensationData[yvKey]}</td>
          </tr>
        );
      }
    }

    return allowances;
  };

  return (
    <div className="view-compensation">
      <h2>Compensation Data</h2>
      <div className="employee-info">
        <div className="info-column">
          <div className="info-item">
            <p>Employee Name:</p>
            <div className="underscore">{employeeName}</div>
          </div>
          <div className="info-item">
            <p>Date of Joining:</p>
            <div className="underscore">{dateOfJoining}</div>
          </div>
          <div className="info-item">
            <p>Financial Year:</p>
            <div className="underscore">{compensationData.financial_year}</div>
          </div>
        </div>
        <div className="info-column">
          <div className="info-item">
            <p>Employee ID:</p>
            <div className="underscore">{employeeId}</div>
          </div>
          <div className="info-item">
            <p>Employee Type:</p>
            <div className="underscore">{employeeType}</div>
          </div>
        </div>
      </div>
      <table className="compensation-table">
        <thead>
          <tr>
            <th>Fixed Part Compensation</th>
            <th>Monthly Value</th>
            <th>Yearly Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base Pay</td>
            <td style={{ textAlign: "right" }}>
              {compensationData.base_pay_mv}
            </td>
            <td style={{ textAlign: "right" }}>
              {compensationData.base_pay_yv}
            </td>
          </tr>
          {renderAllowanceRows()} {/* Render dynamic allowance rows */}
          <tr>
            <td>Company Contribution towards PF</td>
            <td style={{ textAlign: "right" }}>{compensationData.ccpf_mv}</td>
            <td style={{ textAlign: "right" }}>{compensationData.ccpf_yv}</td>
          </tr>
        </tbody>
      </table>
      <table className="compensation-table variable-payment">
        <thead>
          <tr>
            <th>Variable Payment</th>
            <th>Yearly Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Performance Bonus</td>
            <td style={{ textAlign: "right" }}>
              {compensationData.performance_bonus}
            </td>
          </tr>
          <tr className="highlight-tctc">
            <td>Total Cost to Company (TCTC)</td>
            <td style={{ textAlign: "right" }}>{compensationData.tctc}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewCompensation;
