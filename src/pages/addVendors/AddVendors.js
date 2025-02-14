import React, { useEffect, useState } from "react";
import "./AddVendors.css";
import { Avatar, Button, CircularProgress, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";
import { useAuthContextProvider } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const AddVendors = () => {
  const handleBack = () => {
    window.history.back();
  };

  const [input, setInput] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    postal: "",
    country: "",
  });
  const [profilePic, setProfilePic] = useState(null); // For image preview
  const [file, setFile] = useState(null); // For uploading to backend
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { error, createNewVendor } = useAuthContextProvider();
  const navigate = useNavigate();

  const { name, email, phone, gender, dob, address, city, postal, country } =
    input;

  const validateForm = () => {
    let errors = {};
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
    if (!/^\d{10}$/.test(phone))
      errors.phone = "Phone number must be 10 digits";
    if (!/^\d{6}$/.test(postal)) errors.postal = "Postal code must be 6 digits";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setProfilePic(URL.createObjectURL(selectedFile)); // Preview
      setFile(selectedFile); // For submission
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !country ||
      !gender ||
      !postal ||
      !dob
    ) {
      return toast.error("Kindly provide all required credentials");
    }

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("gender", gender);
      formData.append("dob", dob);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("postal", postal);
      formData.append("country", country);
      if (file) formData.append("profilePicture", file); // Append profile picture

      const response = await createNewVendor(formData); // Make sure API handles multipart/form-data

      if (response && response.success) {
        toast.success("Vendor created successfully!");
        setInput({
          name: "",
          email: "",
          phone: "",
          gender: "",
          dob: "",
          address: "",
          city: "",
          postal: "",
          country: "",
        });
        setProfilePic(null);
        setFile(null);
        setLoading(false);
        navigate("/vendordetails");
      }
    } catch (error) {
      toast.error("Failed to create a new vendor. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setLoading(false);
    }
  }, [error]);

  return (
    <div className="addVendorsMainContainer">
      <div className="addVendorsContainer">
        <div className="upperSection">
          <p>Add Vendor</p>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </div>
        <div className="lowerSection">
          <div className="profilePhotoSection">
            <Avatar
              className="profileImage"
              src={profilePic} // Display the selected image
              alt="Profile"
            />
            <div className="editIconContainer">
              <Tooltip title="Choose profile picture">
                <label htmlFor="fileInput">
                  <EditIcon className="editIcon" />
                </label>
              </Tooltip>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }} // Hide the input
                accept="image/*"
                onChange={handleFileChange}
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
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Contact Number</label>
                  <input
                    type="number"
                    name="phone"
                    value={phone}
                    onChange={handleChange}
                    placeholder="Enter Contact Number"
                  />
                  {formErrors.phone && (
                    <span style={{ color: "red" }}>{formErrors.phone}</span>
                  )}
                </div>
                <div className="leftContainer-1">
                  <label>Gender</label>
                  <select name="gender" value={gender} onChange={handleChange}>
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
                    value={address}
                    onChange={handleChange}
                    placeholder="Enter Address"
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postal"
                    value={postal}
                    onChange={handleChange}
                    placeholder="Enter Postal Code"
                  />
                </div>
              </div>
              <div className="rightContainer">
                <div className="rightContainer-1">
                  <label>Email Id</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter Email Id"
                  />
                  {formErrors.email && (
                    <span style={{ color: "red" }}>{formErrors.email}</span>
                  )}
                </div>
                <div className="rightContainer-1">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={dob}
                    onChange={handleChange}
                  />
                </div>
                <div className="rightContainer-1">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={handleChange}
                    placeholder="Enter City"
                  />
                </div>
                <div className="rightContainer-1">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={country}
                    onChange={handleChange}
                    placeholder="Enter Country"
                  />
                </div>
              </div>
            </form>
            <div className="actionContainer">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="createVendorBtn"
                variant="contained"
              >
                {loading ? <CircularProgress size={20} /> : "Create Vendor"}
              </Button>
              <Button
                onClick={handleBack}
                className="cancelBtn"
                variant="outlined"
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

export default AddVendors;
