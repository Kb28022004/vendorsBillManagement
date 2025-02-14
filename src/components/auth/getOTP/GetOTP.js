import React, { useEffect, useState } from "react";
import "./GetOTP.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  CircularProgress,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Timer from "../../../helper/Timer";

const GetOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setloading] = useState(false);
  const [otpTime, setotpTime] = useState(null);
  const [isExpire, setisExpire] = useState(false);
  const navigate=useNavigate()

  const handleChange = (e) => {
    const { value } = e.target;

    // Allow only numbers and restrict length to 6
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    } else {
      toast.error("Only numbers are allowed");
    }
  };
  
  useEffect(() => {
    const getTime = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/v1/user/otp/time", {
          token: localStorage.getItem("passToken"),
        });

        const result = res.data;

        if (result?.status) {
          const remainingTime = new Date(result?.sendTime).getTime() - new Date().getTime();
          if (remainingTime > 0) {
            setotpTime(remainingTime);
          } else {
            setisExpire(true);
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch OTP time.");
      }
    };

    getTime();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/user/verify/otp", {
        otp,
      });

      const result = res.data;

      if (result?.status) {
        setloading(false);
        toast.success(result?.message);
        navigate("/reset-password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
      setloading(false);
    }
  };
  const onResendButtonClick = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/v1/user/forget/password", {
        email: localStorage.getItem("email"),
      });

      const result = res.data;

      if (result?.status) {
        toast.success(result?.message);
        localStorage.setItem("passToken", result?.token);
        setotpTime(1 * 60 * 1000);
        setisExpire(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <>
      <div className="verifyOTPContainer">
        <div className="victorImage">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKpLRuLtBK4dBUfGK-GAu1wio7ESXhKUttoQ&s"
            alt=""
            srcSet=""
          />
        </div>
        <div className="verifyOTP">
          <h1 style={{ textAlign: "center" }}>LOGO</h1>
          <form onSubmit={handleSubmit}>
            <div className="section-1">
              <Typography variant="h5">Forgot Password?</Typography>
              <Typography variant="body2" style={{ color: "#ADADBD" }}>
                We have sent a verification code to your mobile number
              </Typography>
            </div>
            <div className="section-2">
              <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>
                OTP
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiInputBase-root": {
                    height: "30px", // Adjust the height here
                  },
                }}
                fullWidth
                size="small"
                type="text" // Use "text" to prevent browser input controls for numbers
                name="otp"
                value={otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon fontSize="small" />
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
                {loading ? <CircularProgress size={20} /> : "Verify OTP"}
              </Button>
            </div>
            <div >
            {otpTime !== null && !isExpire ? (
              <Timer setisExpire={setisExpire} time={otpTime} />
            ) : (
              <span
                onClick={onResendButtonClick}
                style={{
                  top: "5px",
                  padding: "6px",
                  borderRadius: "5px",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Resend OTP
              </span>
            )}
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

export default GetOTP;
