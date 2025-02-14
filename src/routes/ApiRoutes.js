import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Login from "../components/auth/login/Login";
import Register from "../components/auth/register/Register";
import AdminDashboard from "../pages/adminDashboard/AdminDashboard";
import Dashboard from "../components/layout/dashboard/Dashboard";  // Import the Dashboard component
import ForgotPassword from "../components/auth/forgetPassword/ForgotPassword";
import GetOTP from "../components/auth/getOTP/GetOTP";
import ResetPassword from "../components/auth/resetPassword/ResetPassword";
import VendorDetails from "../pages/vendorDetails/VendorDetails";
import Payments from "../pages/payments/Payments";
import BillGenerates from "../pages/billGenerates/BillGenerates";
import Notifications from "../pages/notifications/Notifications";
import VendorProfile from "../pages/vendorProfile/VendorProfile";
import AddVendors from "../pages/addVendors/AddVendors";
import EditVendors from "../pages/editVendors/EditVendors";
import UpdateBill from "../pages/updateBill/UpdateBill";
import { useAuthContextProvider } from "../context/authContext";
import ProtectedRoute from "./protectedRoutes";

const ApiRoutes = () => {
  const { isAuthenticated } = useAuthContextProvider();

  const routes = [
    { path: "/", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/getotp", element: <GetOTP /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/forgot-password", element: <ForgotPassword /> },

    // Protect the dashboard route and its children
    {
      path: "/",
      element: (
        <ProtectedRoute element={<Dashboard />} />  // Wrap Dashboard with ProtectedRoute
      ),
      children: [
        {
          path: "/dashboard",  // Admin Dashboard (if you have a specific path for admin)
          element: <AdminDashboard />,
        },
        {
          path: "/vendordetails",
          element: <VendorDetails />,
        },
        {
          path: "/vendordetails/:keyword",
          element: <VendorDetails />,
        },
        {
          path: "/billgenerates",
          element: <BillGenerates />,
        },
        {
          path: "/payments",
          element: <Payments />,
        },
        {
          path: "/notifications",
          element: <Notifications />,
        },
        {
          path: "/vendorprofile/:id",
          element: <VendorProfile />,
        },
        {
          path: "/addvendor",
          element: <AddVendors />,
        },
        {
          path: "/editvendor/:id",
          element: <EditVendors />,
        },
        {
          path: "/updatebill/:id",
          element: <UpdateBill />,
        },
      ],
    },

    // Fallback route in case a user tries to access a non-existing route
    { path: "*", element: <Navigate to="/" replace /> },
  ];

  return useRoutes(routes);
};

export default ApiRoutes;
