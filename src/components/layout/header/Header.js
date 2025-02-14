import React, { useEffect, useState } from "react";
import "./Header.css";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuthContextProvider } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";

const Header = ({ openSidebar, setopenSidebar }) => {
  const [keyword, setKeyword] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null); // For debouncing
  const navigate = useNavigate();

  const handleMenuClick = () => {
    setopenSidebar(!openSidebar); // Toggle sidebar
  };

  const { isAuthenticated, user } = useAuthContextProvider(); // Get user details from context

  // Function to handle search
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/vendordetails/${searchTerm}`);
    }
  };

  // Debounce the search to prevent too many rapid API calls
  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    // Clear the previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new debounce timer (300ms delay)
    const timer = setTimeout(() => {
      handleSearch(value);
    }, 300); // Adjust the delay time as needed (300ms is common)

    setDebounceTimer(timer);
  };

  return (
    <div className="header">
      <div className="leftItems">
        {/* Menu Icon */}
        <div className="menuIcon">
          <Tooltip title="Toggle Sidebar">
            <MenuIcon onClick={handleMenuClick} fontSize="medium" />
          </Tooltip>
        </div>
        <div className="leftItem-2">
          <h3>Dashboard</h3>
        </div>
      </div>

      <div className="rightItems">
        {/* Search Bar */}
        <div className="searchBar">
          <SearchIcon className="searchIcon" />
          <input
            value={keyword}
            onChange={handleInputChange}
            placeholder="Search for vendors"
            type="search"
          />
        </div>

        {/* Notification and User Info */}
        <div className="rightItem-2">
          <div className="notification">
            <Tooltip title="Notifications">
              <NotificationsIcon
                fontSize="small"
                className="notificationIcon"
              />
            </Tooltip>
          </div>
          <div className="userImage">
            {isAuthenticated && user?.fullName ? (
              <p style={{ color: "white" }}>{user?.fullName}</p>
            ) : (
              <Avatar className="avtarPic" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
