import React, { useEffect, useState } from "react";
import "./EditVendors.css";
import { Avatar, Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { useAuthContextProvider } from "../../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditVendors = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
    postal: "",
    email: "",
    vendorId: "",
    dob: "",
    city: "",
    country: "",
    profilePicture: "", // Store preview URL
    profilePicFile: null, // Store actual file for API submission
  });
  const [loading, setloading] = useState(false);

  const { error, updateVendor, vendor, getSingleVendorDetails, getAllVendors } = useAuthContextProvider();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getSingleVendorDetails(id);
  }, [id]);

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        phone: vendor.phone || "",
        gender: vendor.gender || "",
        address: vendor.address || "",
        postal: vendor.postal || "",
        email: vendor.email || "",
        vendorId: vendor._id || "",
        dob: vendor.dob || "",
        city: vendor.city || "",
        country: vendor.country || "",
        profilePicture: vendor.profilePicture?.url || "", // Set existing profile pic
      });
    }

    if (error) {
      toast.error(error);
      setloading(false);
    }
  }, [vendor, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profilePicture: imageUrl,
        profilePicFile: file,
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setloading(true);

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "profilePicture") {
          formDataToSend.append(key, value);
        }
      });

      if (formData.profilePicFile) {
        formDataToSend.append("profilePicture", formData.profilePicFile);
      }

      const response = await updateVendor(id, formDataToSend);

      if (response) {
        setloading(false);
        toast.success("Vendor has been updated successfully");
        navigate("/vendordetails");
        getAllVendors();
      }
    } catch (error) {
      toast.error("Unable to update, please try again");
      setloading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (!vendor) {
    return (
      <div className="editVendorsMainContainer">
        <div className="editVendorsContainer">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="editVendorsMainContainer">
      <div className="editVendorsContainer">
        <div className="upperSection">
          <p>Edit Vendor</p>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </div>
        <div className="lowerSection">
          <div className="profilePhotoSection">
            <Avatar
              src={formData.profilePicture || "https://via.placeholder.com/150"}
              alt="Vendor Profile"
              className="profileImage"
              sx={{ width: 100, height: 100 }}
            />
            <div className="editIconContainer">
              <label htmlFor="profilePicUpload">
                <EditIcon className="editIcon" style={{ cursor: "pointer" }} />
              </label>
              <input
                type="file"
                id="profilePicUpload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
              />
            </div>
          </div>
          <div className="personalDetailsSection">
            <form className="personalDetails">
              <div className="leftContainer">
                <div className="leftContainer-1">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Contact Number</label>
                  <input
                    type="number"
                    name="phone"
                    placeholder="Enter Contact Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="leftContainer-1">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postal"
                    placeholder="Enter Postal Code"
                    value={formData.postal}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="rightContainer">
                <div className="rightContainer-1">
                  <label>Email Id</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email Id"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="rightContainer-1">
                  <label>Vendor Id</label>
                  <input
                    type="text"
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="rightContainer-1">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    placeholder="Select Date of Birth"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="rightContainer-1">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="rightContainer-1">
                  <label>Country</label>
                  <input
                    name="country"
                    placeholder="Enter Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </form>
            <div className="actionContainer">
              <Button
                className="createVendorBtn"
                variant="contained"
                onClick={handleUpdate}
              >
                {loading ? <CircularProgress /> : "Update Vendor"}
              </Button>
              <Button
                disabled={loading}
                className="cancelBtn"
                variant="outlined"
                onClick={handleBack}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVendors;
