import React, { useState, useEffect } from "react";
import "./Login.css";
import {
  Button,
  Checkbox,
  CircularProgress,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import toast from "react-hot-toast";
import { useAuthContextProvider } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const [loading, setloading] = useState(false);
  const { error, user, loginUser } = useAuthContextProvider();
  const navigate = useNavigate();

  // Redirect logged-in users to the dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Redirect to dashboard if user is logged in
    }
  }, [user, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values) => {
    const { email, password } = values;

    if (!email || !password) {
      toast.error("Both credentials are required");
      return;
    }

    try {
      setloading(true);
      const response = await loginUser({ email, password });

      if (response.success) {
        setloading(false);
        // Store user and token in localStorage
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);

        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Failed to login. Please try again.");
        setloading(false);
      }
    } catch (error) {
      console.error(error);
      setloading(false);
      toast.error("Unable to login");
    }
  };

  return (
    <div className="loginContainer">
      <div className="victorImage">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKpLRuLtBK4dBUfGK-GAu1wio7ESXhKUttoQ&s"
          alt=""
        />
      </div>
      <div className="login">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            errors,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="section-1">
                <Typography variant="h5">Sign In</Typography>
                <Typography variant="body2" style={{ color: "#ADADBD" }}>
                  Enter your details below to log in to your account
                </Typography>
              </div>
              <div className="section-2">
                <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>Email ID</InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Email"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    style: { fontSize: "12px" },
                  }}
                />
                <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>Password</InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="6 + Strong Character"
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    style: { fontSize: "12px" },
                  }}
                />
              </div>
              <div className="section-3">
                <div className="section-3.1">
                  <Checkbox />
                  <Typography variant="body2">Remember Me</Typography>
                </div>
                <div>
                  <a href="/forgot-password">Forgot Password?</a>
                </div>
              </div>
              <div className="section-4">
                <Button disabled={loading} type="submit" fullWidth variant="contained">
                  {loading ? <CircularProgress size={18}  /> : "Login"}
                </Button>
              </div>
              <div className="section-5">
                <p>
                  Don't have an account? <a href="/register">Sign up for free</a>
                </p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
