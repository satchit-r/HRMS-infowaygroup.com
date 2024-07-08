import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const PrivilegedTab = () => {
  return (
    <div className="tabs-photo-container">
      <Tabs className="tabs-container">
        <TabList>
          <Tab>Set Employee Data</Tab>
          <Tab>Set View Compensation</Tab>
          <Tab>Set View Benefits</Tab>
          <Tab>Set Time Entry (weekly)</Tab>
          <Tab>Set Time Entry (monthly)</Tab>
          <Tab>Set View Projects</Tab>
          <Tab>Set Leave</Tab>
          <Tab>Set View Payslips</Tab>
          <Tab>Set View Tax Summary</Tab>
          <Tab>Set View Tax Summary</Tab>
          <Tab>Set View Tax Summary</Tab>
          <Tab>Set View Tax Summary</Tab>
        </TabList>

        <TabPanel>
          <h2>Set Employee Data</h2>
          <p>Form and settings for Employee Data go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set View Compensation</h2>
          <p>Form and settings for Compensation go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set View Benefits</h2>
          <p>Form and settings for Benefits go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set Time Entry (weekly)</h2>
          <p>Form and settings for weekly time entry go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set Time Entry (monthly)</h2>
          <p>Form and settings for monthly time entry go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set View Projects</h2>
          <p>Form and settings for Projects go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set Leave</h2>
          <p>Form and settings for Leave go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set View Payslips</h2>
          <p>Form and settings for Payslips go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set View Tax Summary</h2>
          <p>Form and settings for Tax Summary go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set View Tax Summary</h2>
          <p>Form and settings for Tax Summary go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set View Tax Summary</h2>
          <p>Form and settings for Tax Summary go here...</p>
        </TabPanel>
        <TabPanel>
          <h2>Set View Tax Summary</h2>
          <p>Form and settings for Tax Summary go here...</p>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default PrivilegedTab;
