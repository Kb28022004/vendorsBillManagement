import React, { createContext, useContext, useReducer, useEffect } from "react";
import reducer from "../reducer/authReducer";
import axios from "axios";

const AuthContext = createContext();

const API = "http://localhost:8000/api/v1";

const initialState = {
  loading: false,
  users: [],
  user: JSON.parse(localStorage.getItem("user")) || {},
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
  newVendor: {},
  vendorCounts: 0,
  currentPage: 1,
  resultPerPage: 0,
  vendors: [],

  vendor: {},
  isDeleted: false,
  isUpdated: false,
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Checking for user data and token on page load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (user && token) {
      dispatch({ type: "USER_LOGIN_SUCCESS", payload: user });
    }
  }, []);

  const registerUser = async (registeredData) => {
    try {
      dispatch({ type: "USER_REGISTER_REQUEST" });
      const { data } = await axios.post(
        `${API}/user/register`,
        registeredData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({ type: "USER_REGISTER_SUCCESS", payload: data.user });
      return { success: true, message: "Registration successful" };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({ type: "USER_REGISTER_FAIL", payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const loginUser = async (loginCredentials) => {
    try {
      dispatch({ type: "USER_LOGIN_REQUEST" });
      const { data } = await axios.post(`${API}/user/login`, loginCredentials, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: "USER_LOGIN_SUCCESS", payload: data.user });
      return { success: true, user: data.user, token: data.token };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({ type: "USER_LOGIN_FAIL", payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const logoutUser = async () => {
    try {
      // Call your API to handle the logout
      await axios.get(`${API}/user/logout`, {
        withCredentials: true,
      });

      // Remove user and token from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Dispatch logout success to update the state
      dispatch({ type: "USER_LOGOUT_SUCCESS" });
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      dispatch({ type: "USER_LOGOUT_FAIL", payload: errorMessage });
    }
  };

  // create a new vendor

  const createNewVendor = async (vendorDetails) => {
    try {
      dispatch({ type: "CREATE_VENDOR_REQUEST" });

      const { data } = await axios.post(
        `${API}/vender/admin/create`,
        vendorDetails,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({ type: "CREATE_VENDOR_SUCCESS", payload: data.newVendor });
      return { success: true, message: "Veder has been created successful" };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({ type: "CREATE_VENDOR_FAIL", payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const getAllVendors = async (keyword = "" ,page = 1) => {
    try {
      dispatch({ type: "GET_ALL_VENDOR_REQUEST" });
      const { data } = await axios.get(
        `${API}/vender/getallvendors?keyword=${keyword}&page=${page}`,
        {
          withCredentials: true,
        }
      );

      // Ensure we correctly pass the values to the reducer
      dispatch({
        type: "GET_ALL_VENDOR_SUCCESS",
        payload: {
          vendors: data.vendors,
          vendorCounts: data.vendorCounts,
          resultPerPage: data.resultPerPage,
          currentPage: page,
        },
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: "GET_ALL_VENDOR_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  const getSingleVendorDetails = async (id) => {
    try {
      dispatch({ type: "GET_SINGLE_VENDOR_REQUEST" });
      const { data } = await axios.get(`${API}/vender/getsinglevendor/${id}`, {
        withCredentials: true,
      });

      // Ensure we correctly pass the values to the reducer
      dispatch({
        type: "GET_SINGLE_VENDOR_SUCCESS",
        payload: data,
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: "GET_SINGLE_VENDOR_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  const deleteVendor = async (id) => {
    try {
      dispatch({ type: "DELETE_VENDOR_REQUEST" });
      const { data } = await axios.delete(`${API}/vender/admin/delete/${id}`, {
        withCredentials: true,
      });

      // Ensure we correctly pass the values to the reducer
      dispatch({
        type: "DELETE_VENDOR_SUCCESS",
        payload: data.success,
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: "DELETE_VENDOR_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  const updateVendor=async(id,updatedDetails)=>{
    try {
      dispatch({ type: "UPDATE_VENDOR_REQUEST" });
      const { data } = await axios.put(`${API}/vender/admin/update/${id}`,updatedDetails, {
        withCredentials: true,
        headers:{
          'Content-Type':'multipart/form-data'
        }
      });

      // Ensure we correctly pass the values to the reducer
      dispatch({
        type: "UPDATE_VENDOR_SUCCESS",
        payload: data.success,
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: "UPDATE_VENDOR_FAIL",
        payload: error.response?.data?.message,
      });
    }
  }

  // get all vendors without pagination

  const getAllVendorsWithoutPagination=async()=>{
    try {
      dispatch({ type: "GET_ALL_ADMIN_VENDORS_REQUEST" });
      const { data } = await axios.get(`${API}/vender/admin/allvendors`, {
        withCredentials: true,
      
      });

      // Ensure we correctly pass the values to the reducer
      dispatch({
        type: "GET_ALL_ADMIN_VENDORS_SUCCESS",
        payload: data.vendors,
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: "GET_ALL_ADMIN_VENDORS_FAIL",
        payload: error.response?.data?.message,
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        registerUser,
        loginUser,
        logoutUser,
        deleteVendor,
        createNewVendor,
        getAllVendors,
        getSingleVendorDetails,
        updateVendor,
        getAllVendorsWithoutPagination
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuthContextProvider = () => {
  return useContext(AuthContext);
};

export { AuthContext, useAuthContextProvider, AuthProvider };
