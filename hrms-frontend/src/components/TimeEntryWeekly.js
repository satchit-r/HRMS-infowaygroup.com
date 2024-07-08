//src/components/TimeEntryWeekly.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "../styles/TimeEntryWeekly.css";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const TimeEntryWeekly = ({ employeeId, employeeName, financialYear }) => {
  const [weekData, setWeekData] = useState(null);
  const [currentWeekData, setCurrentWeekData] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [dropdownData, setDropdownData] = useState({
    row1: {
      first: "",
      second: [],
      secondDropdownValue: "",
      showInput: false,
      days: {
        Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
        Saturday: "",
        Sunday: "",
      },
    },
    row2: {
      first: "",
      second: [],
      secondDropdownValue: "",
      showInput: false,
      days: {
        Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
        Saturday: "",
        Sunday: "",
      },
    },
    row3: {
      first: "",
      second: [],
      secondDropdownValue: "",
      showInput: false,
      days: {
        Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
        Saturday: "",
        Sunday: "",
      },
    },
  });

  useEffect(() => {
    const fetchWeekData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/timeEntry/weekData"
        );
        setWeekData(response.data);
        determineCurrentWeek(response.data);
      } catch (error) {
        console.error("Error fetching week data:", error);
      }
    };

    fetchWeekData();
  }, []);

  useEffect(() => {
    const fetchInitialProjectData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/timeEntry/api/projects/${employeeId}`
        );
        setDropdownData((prevData) => ({
          ...prevData,
          row1: {
            ...prevData.row1,
            second: response.data.map((item) => item.project_id),
          },
          row2: {
            ...prevData.row2,
            second: response.data.map((item) => item.project_id),
          },
        }));
      } catch (error) {
        console.error("Error fetching initial project data:", error);
      }
    };

    fetchInitialProjectData();
  }, [employeeId]);

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/timeEntry/employee/${employeeId}/leave-balance`
        );
        setLeaveBalance(response.data);
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      }
    };

    fetchLeaveBalance();
  }, [employeeId, financialYear]);

  const determineCurrentWeek = (data) => {
    const today = dayjs(); // Get today's date
    const currentWeek = data.find(
      (week) =>
        dayjs(week.wk_start_date).isSameOrBefore(today, "day") &&
        dayjs(week.wk_end_date).isSameOrAfter(today, "day")
    );
    setCurrentWeekData(currentWeek);
  };

  const handleFirstDropdownChange = async (row, value) => {
    const updatedDropdownData = { ...dropdownData };
    updatedDropdownData[row].first = value;

    // Reset second dropdown's selected value
    updatedDropdownData[row].secondDropdownValue = "";
    updatedDropdownData[row].showInput = false;

    try {
      let response;
      switch (value) {
        case "Project":
          response = await axios.get(
            `http://localhost:5000/api/timeEntry/api/projects/${employeeId}`
          );
          Object.keys(updatedDropdownData).forEach((key) => {
            if (key.startsWith("row")) {
              updatedDropdownData.row1.second = response.data.map(
                (item) => item.project_id
              );
              updatedDropdownData.row2.second = response.data.map(
                (item) => item.project_id
              );
            }
          });
          break;
        case "Holiday":
          response = await axios.get(
            "http://localhost:5000/api/timeEntry/api/holidays"
          );
          updatedDropdownData[row].second = response.data.map(
            (item) => item.holiday_desc || item.leave_desc
          );
          break;
        case "Leave":
          response = await axios.get(
            "http://localhost:5000/api/timeEntry/api/leaves"
          );
          updatedDropdownData[row].second = response.data.map(
            (item) => item.holiday_desc || item.leave_desc
          );
          break;
        case "Loss of pay":
          // Handle Loss of pay scenario
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching data for ${value}:`, error);
    }

    setDropdownData(updatedDropdownData);
  };

  const handleInputChange = (row, day, value) => {
    // Ensure only one input per day
    for (let key in dropdownData) {
      if (key !== row && dropdownData[key].days[day]) {
        alert("Only one input is allowed per day");
        return;
      }
    }

    // Allow numeric and decimal inputs
    if (!/^\d*\.?\d*$/.test(value)) {
      alert("Input must be a number or decimal");
      return;
    }

    setDropdownData((prevData) => ({
      ...prevData,
      [row]: {
        ...prevData[row],
        days: {
          ...prevData[row].days,
          [day]: value,
        },
      },
    }));
  };

  const fetchTimeEntries = async () => {
    try {
      if (
        !currentWeekData ||
        !currentWeekData.wk_start_date ||
        !currentWeekData.wk_end_date
      ) {
        console.error("Invalid currentWeekData:", currentWeekData);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/timeEntry/employeeTimeEntries/${employeeId}/${currentWeekData.wk_start_date}/${currentWeekData.wk_end_date}`
      );
      // Log the fetched data for debugging
      console.log("Fetched time entries:", response.data);
      // Process the fetched data and update state accordingly
      processTimeEntries(response.data);
    } catch (error) {
      console.error("Error fetching time entries:", error);
    }
  };
  const processTimeEntries = (entries) => {
    const updatedDropdownData = { ...dropdownData };

    entries.forEach((entry) => {
      const rowKey = Object.keys(updatedDropdownData).find(
        (key) => updatedDropdownData[key].first === entry.type_1
      );

      if (rowKey) {
        // Update the specific day's clocked hours
        updatedDropdownData[rowKey].days[entry.day_of_week] =
          entry.clocked_hrs.toString();

        // Check if entry.type_2 matches one of the dropdown options in `second`
        const matchedOption = updatedDropdownData[rowKey].second.includes(
          entry.type_2
        );

        if (matchedOption) {
          updatedDropdownData[rowKey].secondDropdownValue = entry.type_2;
        } else {
          // If entry.type_2 does not match, set it to empty string or default value
          updatedDropdownData[rowKey].secondDropdownValue = "";
        }
      }
    });

    setDropdownData(updatedDropdownData);
    console.log("Updated dropdown data:", updatedDropdownData);
  };

  const handleSecondDropdownChange = (row, value) => {
    const updatedDropdownData = { ...dropdownData };
    updatedDropdownData[row].secondDropdownValue = value;

    // Set showInput to true only if both dropdowns are selected
    updatedDropdownData[row].showInput =
      !!value && !!updatedDropdownData[row].first;

    setDropdownData(updatedDropdownData);

    fetchTimeEntries();
  };

  const handleCancel = () => {
    setDropdownData({
      row1: {
        first: "Project",
        second: [],
        secondDropdownValue: "",
        showInput: false,
        days: {
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
          Saturday: "",
          Sunday: "",
        },
      },
      row2: {
        first: "",
        second: [],
        secondDropdownValue: "",
        showInput: false,
        days: {
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
          Saturday: "",
          Sunday: "",
        },
      },
      row3: {
        first: "",
        second: [],
        secondDropdownValue: "",
        showInput: false,
        days: {
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
          Saturday: "",
          Sunday: "",
        },
      },
    });
  };

  if (!weekData) {
    return <div>Loading...</div>;
  }

  if (!currentWeekData) {
    return <div>No data available for the current week.</div>;
  }

  const weekBeginning = currentWeekData.wk_start_date
    ? currentWeekData.wk_start_date.split("T")[0]
    : "";
  const weekEnding = currentWeekData.wk_end_date
    ? currentWeekData.wk_end_date.split("T")[0]
    : "";

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  const dates = [];
  let startDate = new Date(currentWeekData.wk_start_date);
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    dates.push(`${date.getDate()}/${date.getMonth() + 1}`);
    startDate.setDate(startDate.getDate() + 1);
  }

  const handleSave = async () => {
    try {
      const promises = Object.keys(dropdownData).flatMap((row) => {
        const { first, secondDropdownValue, days } = dropdownData[row];
        if (first && secondDropdownValue) {
          return Object.keys(days).map(async (day, index) => {
            const clockedHrs = days[day];
            if (clockedHrs) {
              const dayDate = dayjs(currentWeekData.wk_start_date)
                .add(index, "day")
                .format("YYYY-MM-DD");

              // Post time entry data
              await axios.post(
                "http://localhost:5000/api/timeEntry/employeeTimeEntry",
                {
                  Employee_Id: employeeId,
                  Financial_year: currentWeekData.financial_year,
                  Date: dayDate,
                  Day_of_week: day,
                  Type_1: first,
                  Type_2: secondDropdownValue,
                  Clocked_hrs: parseFloat(clockedHrs), // Ensure clockedHrs is a number
                  Approval_status: "pending", // Assuming default value
                }
              );

              // Check if type_1 is 'leave' and update leave balance
              if (first.toLowerCase() === "leave") {
                let leaveCode;
                switch (secondDropdownValue) {
                  case "Casual Leave":
                    leaveCode = "CL";
                    break;
                  case "Sick Leave":
                    leaveCode = "SL";
                    break;
                  case "Emergency Leave":
                    leaveCode = "EL";
                    break;
                  case "Privilege Leave":
                    leaveCode = "PL";
                    break;
                  // Add more cases as needed for other leave types
                  default:
                    leaveCode = ""; // Handle default case or validation
                    break;
                }

                if (leaveCode) {
                  try {
                    const leaveData = {
                      financialYear: currentWeekData.financial_year,
                      leaveCode,
                      days: 1, // Each clockedHrs entry represents one day of leave
                    };

                    console.log("Posting leave data:", leaveData);

                    await axios.post(
                      `http://localhost:5000/api/timeEntry/employee/${employeeId}/leave`,
                      leaveData
                    );
                  } catch (error) {
                    if (error.response) {
                      console.error(
                        "Error response data:",
                        error.response.data
                      );
                      console.error(
                        "Error response status:",
                        error.response.status
                      );
                      console.error(
                        "Error response headers:",
                        error.response.headers
                      );
                    } else {
                      console.error("Error message:", error.message);
                    }
                    throw error; // Rethrow to propagate error to the outer catch block
                  }
                } else {
                  console.error(
                    "Invalid leave type selected:",
                    secondDropdownValue
                  );
                }
              }
            }
          });
        }
        return null; // Skip posting if dropdowns not selected
      });

      // Flatten the promises array and wait for all to complete
      await Promise.all(promises.flat().filter(Boolean));

      // Display success message
      window.alert("Time entries and leave balances updated successfully!");
      console.log("Time entries and leave balances updated successfully!");
    } catch (error) {
      console.error(
        "Error saving time entries and updating leave balances:",
        error
      );
      // Handle error state or display error message
    }
  };

  return (
    <div className="time-entry-container">
      <h2>Time Entry</h2>
      <div className="time-entry-info">
        <div className="info-column">
          <div className="info-item">
            <p>Employee ID:</p>
            <div className="underscore">{employeeId}</div>
          </div>
          <div className="info-item">
            <p>Financial year:</p>
            <div className="underscore">{currentWeekData.financial_year}</div>
          </div>
          <div className="info-item">
            <p>Week beginning:</p>
            <div className="underscore">{weekBeginning}</div>
          </div>
          <div className="info-item">
            <p>Month/year:</p>
            <div className="underscore">
              {currentMonth} / {currentYear}
            </div>
          </div>
        </div>
        <div className="info-column">
          <div className="info-item">
            <p>Employee Name:</p>
            <div className="underscore">{employeeName}</div>
          </div>
          <div className="info-item">
            <p>Week #:</p>
            <div className="underscore">{currentWeekData.week_no}</div>
          </div>
          <div className="info-item">
            <p>Week ending:</p>
            <div className="underscore">{weekEnding}</div>
          </div>
        </div>
      </div>
      <table className="time-entry-table">
        <thead>
          <tr>
            <th></th>
            <th></th>
            {Object.keys(dropdownData.row1.days).map((day, index) => (
              <th key={index}>
                {day}
                <br />
                <span className="date">{dates[index]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(dropdownData).map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <select
                  value={dropdownData[row].first}
                  onChange={(e) =>
                    handleFirstDropdownChange(row, e.target.value)
                  }
                >
                  <option value="">Select Type</option>
                  <option value="Project">Project</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Leave">Leave</option>
                  <option value="Loss of pay">Loss of pay</option>
                </select>
              </td>
              <td>
                <select
                  value={dropdownData[row].secondDropdownValue}
                  onChange={(e) =>
                    handleSecondDropdownChange(row, e.target.value)
                  }
                  disabled={!dropdownData[row].first}
                >
                  <option value="">Select</option>
                  {dropdownData[row].second.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              {Object.keys(dropdownData[row].days).map((day, dayIndex) => (
                <td key={dayIndex}>
                  {dropdownData[row].showInput && (
                    <input
                      type="text"
                      value={dropdownData[row].days[day]}
                      onChange={(e) =>
                        handleInputChange(row, day, e.target.value)
                      }
                      maxLength="4" // limit input length to 3 digits
                      size="4" // make the input smaller
                      pattern="[0-8]{0,1}(\.[0-9]{0,2})?" // allow only numeric input
                      onInput={(e) => {
                        if (
                          !/^[0-8]{0,1}(\.[0-9]{0,2})?$/.test(e.target.value)
                        ) {
                          alert("Please enter a number up to 8.00");
                          e.target.value = ""; // clear invalid input
                        }
                      }}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <table className="leave-balance">
        <thead>
          <tr>
            <th>Leave Balance</th>
            <th>CL</th>
            <th>SL</th>
            <th>EL</th>
            <th>PL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Opening balance</td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "CL")
                ? leaveBalance.find((item) => item.leave_code === "CL")
                    .opening_bal
                : "--"}
            </td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "SL")
                ? leaveBalance.find((item) => item.leave_code === "SL")
                    .opening_bal
                : "--"}
            </td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "EL")
                ? leaveBalance.find((item) => item.leave_code === "EL")
                    .opening_bal
                : "--"}
            </td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "PL")
                ? leaveBalance.find((item) => item.leave_code === "PL")
                    .opening_bal
                : "--"}
            </td>
          </tr>
          <tr>
            <td>Availed</td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "CL")
                ? leaveBalance.find((item) => item.leave_code === "CL")
                    .availed_this_year
                : "--"}
            </td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "SL")
                ? leaveBalance.find((item) => item.leave_code === "SL")
                    .availed_this_year
                : "--"}
            </td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "EL")
                ? leaveBalance.find((item) => item.leave_code === "EL")
                    .availed_this_year
                : "--"}
            </td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "PL")
                ? leaveBalance.find((item) => item.leave_code === "PL")
                    .availed_this_year
                : "--"}
            </td>
          </tr>
          <tr>
            <td>Closing balance</td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "CL")
                ? leaveBalance.find((item) => item.leave_code === "CL")
                    .closing_bal
                : "--"}
            </td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "SL")
                ? leaveBalance.find((item) => item.leave_code === "SL")
                    .closing_bal
                : "--"}
            </td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "EL")
                ? leaveBalance.find((item) => item.leave_code === "EL")
                    .closing_bal
                : "--"}
            </td>
            <td>
              {Array.isArray(leaveBalance) &&
              leaveBalance.find((item) => item.leave_code === "PL")
                ? leaveBalance.find((item) => item.leave_code === "PL")
                    .closing_bal
                : "--"}
            </td>
          </tr>
        </tbody>
      </table>

      <h4>Approval Status</h4>
      <table className="approval-status">
        <thead>
          <tr>
            <th>Status</th>
            <th>Approver Name</th>
            <th>Email ID</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{"entry.approval_status"}</td>
            <td>--</td>
            <td>--</td>
          </tr>
        </tbody>
      </table>

      <div className="buttons">
        <button className="submit-button" onClick={handleSave}>
          Submit
        </button>

        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TimeEntryWeekly;
