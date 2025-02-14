import React, { useState } from "react";
import "./ForgotPassword.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

import {
  Button,
  CircularProgress,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setemail] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Kindly provide your registered email to send you otp ");
    }
    setloading(true);

    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/user/forget/password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result?.message || "Something went wrong. Please try again."
        );
      }

      if (result?.status) {
        toast.success(result.message || "OTP sent successfully!");
        setloading(false);
        localStorage.setItem("passToken", result.token);
        localStorage.setItem("email", email);
        navigate("/getotp");
      }
    } catch (error) {
      // Handle unexpected HTML error response
      if (error.message === "Unexpected response format") {
        toast.error(
          "The server responded with an unexpected format. Please try again later."
        );
      } else {
        toast.error(error.message || "Failed to send OTP. Please try again.");
      }
      setloading(false);
    }
  };

  return (
    <>
      <div className="forgotPasswordContainer">
        <div className="victorImage">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKpLRuLtBK4dBUfGK-GAu1wio7ESXhKUttoQ&s"
            alt=""
            srcset=""
          />
        </div>
        <div className="forgotPassword">
          <h1 style={{ textAlign: "center" }}>LOGO</h1>

          <form onSubmit={handleSubmit}>
            <div className="section-1">
              <Typography variant="h5">Forgot Password?</Typography>
              <Typography variant="body2" style={{ color: "#ADADBD" }}>
                Enter your registered email to reset it?
              </Typography>
            </div>
            <div className="section-2">
              <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>
                Email ID
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiInputBase-root": {
                    height: "30px", // Adjust the height here
                  },
                }}
                fullWidth
                size="small"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter Email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  style: { fontSize: "12px" }, // Placeholder text size
                }}
              />
            </div>

            <div className="section-3">
              <Button
                type="submit"
                disabled={loading}
                fullWidth
                variant="contained"
              >
                {loading ? <CircularProgress size={20} /> : " Confirm"}
              </Button>
            </div>
            <div className="section-4">
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

export default ForgotPassword;
