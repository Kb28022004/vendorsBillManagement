import React, { useState } from "react";
import "./ResetPassword.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import {
  Button,
  CircularProgress,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [input, setinput] = useState({
    password: "",
    cfpassword: "",
  });
  const [loading, setloading] = useState(false);
  const [formErrors, setformErrors] = useState({});

  const { password, cfpassword } = input;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setinput((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();
  const validateForm = () => {
    let errors = {};
    if (password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (cfpassword !== password)
      errors.cfpassword = "confirm Password should same as password";

    setformErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!password || !cfpassword) {
      toast.error("Kindly provide essential credentials");
    }
    setloading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/update/password",
        {
          password,
          cfpassword,
          token: localStorage.getItem("passToken"),
        }
      );

      const result = res.data;

      if (result.success) {
        setloading(false);
        toast.success(result?.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed.");
      setloading(false);
    }
  };

  return (
    <>
      <div className="resetPasswordContainer">
        <div className="victorImage">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKpLRuLtBK4dBUfGK-GAu1wio7ESXhKUttoQ&s"
            alt=""
            srcset=""
          />
        </div>
        <div className="resetPassword">
          <h1 style={{ textAlign: "center" }}>LOGO</h1>
          <form onSubmit={handleSubmit}>
            <div className="section-1">
              <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>
                Password
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiInputBase-root": {
                    height: "30px", // Adjust the height here
                  },
                }}
                fullWidth
                size="small"
                type="password"
                value={password}
                error={!!formErrors.password}
                helperText={formErrors.password}
                onChange={handleChange}
                name="password"
                placeholder="6 + Strong Character"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  style: { fontSize: "12px" }, // Placeholder text size
                }}
              />
              <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>
                Confirm Password
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiInputBase-root": {
                    height: "30px", // Adjust the height here
                  },
                }}
                fullWidth
                size="small"
                type="password"
                name="cfpassword"
                value={cfpassword}
                error={!!formErrors.cfpassword}
                helperText={formErrors.cfpassword}
                onChange={handleChange}
                placeholder="Enter confirm password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpenIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  style: { fontSize: "12px" }, // Placeholder text size
                }}
              />
            </div>

            <div className="section-2">
              <Button
                disabled={loading}
                type="submit"
                fullWidth
                variant="contained"
              >
                {loading ? <CircularProgress  size={18}  /> : " Confirm"}
              </Button>
            </div>
            <div className="section-3">
              <div>
                <ArrowBackIcon fullWidth />
              </div>
              <div>
                <a href="/">Return to the Login Page </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
