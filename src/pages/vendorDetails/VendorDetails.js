import React, { useEffect, useState } from "react";
import "./VendorDetails.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuthContextProvider } from "../../context/authContext";
import Loader from "../../helper/loader/Loader";
import toast from "react-hot-toast";

const VendorDetails = () => {
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  

  const navigate = useNavigate();
  const { keyword } = useParams();
  const {
    loading,
    error,
    vendorCounts,
    resultPerPage,
    deleteVendor,
    getAllVendors,
    vendors = [],
  } = useAuthContextProvider();

  const tableRowData = [
    "#",
    "Vendor Id",
    "Vendor Name",
    "Email Id",
    "Address",
    "Mobile Number",
    // "Amount Due",
    // "Due Date",
    "Action",
  ];

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    getAllVendors(value);
  };

  const handleAddVendor = () => {
    navigate("/addvendor");
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteVendor(id);

      if (response) {
        toast.success("Vendor has been deleted successfully");
        getAllVendors();
      }
    } catch (error) {
      toast.error("Unable to delete the vendor, please try again");
    }
  };

  useEffect(() => {
    getAllVendors(keyword || "" ,currentPage);

    if (error) {
      toast.error(error);
    }
  }, [error,keyword, currentPage,]);




  return (
    <div className="vendorDetailsMainContainer">
      <div className="vendorDetails-container">
        {/* Upper Section */}
        <div className="upper-section--container">
          <p>Vendor Details</p>
          <Button
            onClick={handleAddVendor}
            variant="outlined"
            className="addVendorBtn"
          >
            Add Vendor
          </Button>
        </div>

        {/* Table Section */}
        <div className="table-section-container">
          <TableContainer>
            <Table>
              {/* Table Head */}
              <TableHead>
                <TableRow>
                  {tableRowData.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              {loading ? (
                <Loader />
              ) : vendors.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <p>No vendors found</p>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {vendors.map((row, index) => (
                    <TableRow key={row._id}>
                      <TableCell sx={{ fontSize: "10.5px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontSize: "10px" }}>
                        {row._id}
                      </TableCell>
                      <TableCell sx={{ fontSize: "10.5px", width: "22%" }}>
                        {row.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: "10.5px", width: "20%" }}>
                        {row.email}
                      </TableCell>
                      <TableCell sx={{ fontSize: "10.5px", width: "20%" }}>
                        {row.address}
                      </TableCell>
                      <TableCell sx={{ fontSize: "10.5px", width: "20%" }}>
                        {row.phone}
                      </TableCell>
                      {/* <TableCell sx={{ fontSize: "10.5px" }}>
                        {amountDue}
                      </TableCell>
                      <TableCell sx={{ fontSize: "10.5px" }}>
                        {dueDate}
                      </TableCell> */}
                      <TableCell
                        style={{
                          display: "flex",
                          cursor: "pointer",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <NavLink style={{ color: "black" }} to={`/editvendor/${row._id}`}>
                          <Tooltip title="Edit details">
                            <EditOutlinedIcon fontSize="small" />
                          </Tooltip>
                        </NavLink>
                        <NavLink style={{ color: "black" }} to={`/vendorprofile/${row._id}`}>
                          <Tooltip title={`View ${row.name} details`}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </Tooltip>
                        </NavLink>
                        <NavLink style={{ color: "black" }}>
                          <Tooltip title="Delete">
                            <DeleteOutlinedIcon
                              onClick={() => handleDelete(row._id)}
                              fontSize="small"
                            />
                          </Tooltip>
                        </NavLink>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>

        {/* Lower Section */}
        <div className="lower-section-container">
          <p>
            Showing {currentPage} to {resultPerPage * currentPage} entries
          </p>
          {resultPerPage < vendorCounts && (
            <Pagination
              count={Math.ceil(vendorCounts / resultPerPage)} // Calculate total number of pages
              page={currentPage} // Set the current page
              onChange={handlePageChange} // Handle page change
              shape="rounded"
              color="primary"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
