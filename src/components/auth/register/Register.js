import React, { useEffect, useState } from "react";
import "./Register.css";
import {
  Button,
  CircularProgress,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useAuthContextProvider } from "../../../context/authContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const { error: registerError, user, registerUser } = useAuthContextProvider();
  console.log(user);

  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8,"Password must be at least 8 characters"),
    cfpassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "Confirm Password must match Password"
      )
      .required("Confirm Password is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  const handleSubmit = async (values) => {
    const { fullName, phoneNumber, email, password, cfpassword } = values;

    try {
      setloading(true);
      const response = await registerUser({
        fullName,
        phoneNumber,
        email,
        password,
        cfpassword,
      });

      if (response && response.success) {
        // Store user information in localStorage
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            fullName,
            phoneNumber,
            email,
          })
        );

        setloading(false);
        toast.success("Register Successfully");
        navigate("/");
      } else {
        toast.error(
          response.message || "Failed to register. Please try again."
        );
        setloading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to register");
    }
  };

  useEffect(() => {
    if (registerError) {
      toast.error(registerError);
    }
  }, [registerError]);

  return (
    <div className="registerContainer">
      <div className="victorImage">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKpLRuLtBK4dBUfGK-GAu1wio7ESXhKUttoQ&s"
          alt=""
        />
      </div>
      <div className="register">
        <Formik
          initialValues={{
            fullName: "",
            phoneNumber: "",
            email: "",
            password: "",
            cfpassword: "",
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
              <div>
                <Typography variant="h5">Sign Up</Typography>
                <Typography variant="body2" style={{ color: "#ADADBD" }}>
                  Enter your details below to create your account and get
                  started
                </Typography>
              </div>

              <div>
                <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>
                  Full Name
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="fullName"
                  value={values.fullName}
                  error={touched.fullName && !!errors.fullName}
                  helperText={touched.fullName && errors.fullName}
                  placeholder="Your Name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    style: { fontSize: "12px" },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "30px",
                    },
                  }}
                />

                <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>
                  Phone Number
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="phoneNumber"
                  value={values.phoneNumber}
                  error={touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  placeholder="Enter Phone Number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    style: { fontSize: "12px" },
                  }}
                />

                <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>
                  Email ID
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="email"
                  value={values.email}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  placeholder="Enter Email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    style: { fontSize: "12px" },
                  }}
                />

                <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>
                  Password
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="password"
                  value={values.password}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  placeholder="8 + Strong Character"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    style: { fontSize: "12px" },
                  }}
                />

                <InputLabel sx={{ color: "#000000", fontSize: "14px" }}>
                  Confirm Password
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="cfpassword"
                  value={values.cfpassword}
                  error={touched.cfpassword && !!errors.cfpassword}
                  helperText={touched.cfpassword && errors.cfpassword}
                  placeholder="Enter confirm password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOpenIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    style: { fontSize: "12px" },
                  }}
                />

                <Button
                  disabled={loading}
                  type="submit"
                  sx={{ backgroundColor: "black" }}
                  variant="contained"
                >
                  {loading ? <CircularProgress size={18} /> : "Sign Up"}
                </Button>

                <p style={{ textAlign: "center" }}>
                  Already have an account?{" "}
                  <a href="/" style={{ textDecoration: "none" }}>
                    Login
                  </a>
                </p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
