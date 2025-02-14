import React from "react";
import { Drawer, useMediaQuery } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContextProvider } from "../../../context/authContext";
import toast from "react-hot-toast";

import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import "./Sidebar.css";

const Sidebar = ({ openSidebar, setopenSidebar }) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuthContextProvider();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const listData = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { name: "Vendor Details", path: "/vendordetails", icon: <PeopleIcon /> },
    {
      name: "Bill Generate",
      path: "/billgenerates",
      icon: <DescriptionIcon />,
    },
    { name: "Payments", path: "/payments", icon: <AttachMoneyIcon /> },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <NotificationsIcon />,
    },
  ];

  const handleLogout = async () => {
    await logoutUser();
    toast.success("Logout successfully");
    localStorage.removeItem("activePath");
    navigate("/");
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      anchor="left"
      open={openSidebar}
      onClose={() => setopenSidebar(false)}
      sx={{
        width: 234,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 234,
          boxSizing: "border-box",

          background:
            "linear-gradient(to right, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
        },
      }}
    >
      <div className="drawerContainer">
        {/* Logo Section */}
        <div className="logoSection">
          <h1>Logo</h1>
          <hr />
        </div>

        {/* Menu Items */}
        <div className="itemSections">
          {listData.map((item, index) => (
            <NavLink
              style={{ color: "black", textDecoration: "none" }}
              to={item.path}
              key={index}
              className={({ isActive }) =>
                isActive ? "listData active" : "listData"
              }
              onClick={() => isMobile && setopenSidebar(false)}
            >
              <div className="listItem">
                {item.icon}
                <p>{item.name}</p>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Logout Section */}
        <div onClick={handleLogout} className="logoutSection">
          <LogoutIcon />
          <p>Logout</p>
        </div>
      </div>
    </Drawer>
  );
};

export default Sidebar;
