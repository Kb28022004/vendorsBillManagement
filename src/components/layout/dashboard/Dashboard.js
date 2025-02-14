import React, { useState } from "react";
import "./Dashboard.css";
import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

const Dashboard = () => {
  const [openSidebar, setopenSidebar] = useState(true);

  return (
    <div className="dashboardContainer">
 
      {openSidebar && (
        <div>
          <Sidebar openSidebar={openSidebar} setopenSidebar={setopenSidebar} />
        </div>
      )}
      
      <div className="dashboardHeader">
        <Header openSidebar={openSidebar} setopenSidebar={setopenSidebar} />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
