import React, { createContext, useContext, useReducer, useEffect } from "react";
import reducer from "../reducer/billReducer";
import axios from "axios";

const BillContext = createContext();

const API = "http://localhost:8000/api/v1/bill";

const initialState = {
  loading: false,
  error: null,
  bill:{},
  vendorBills:[]
};

const BillProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // bill generate

  const billGenerate = async (billDetails) => {
    try {
      dispatch({ type: "CREATE_NEW_BILL_REQUEST" });
      const { data } = await axios.post(`${API}/createbills`, billDetails, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({ type: "CREATE_NEW_BILL_SUCCESS", payload: data });
      return({success:true})
    } catch (error) {
      dispatch({
        type: "CREATE_NEW_BILL_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  const geVendorBillList = async (id) => {
    try {
      dispatch({ type: "GET_SINGLE_PERSON_ALL_BILL_REQUEST" });
      const { data } = await axios.get(`${API}/singlebill/${id}`, {
        withCredentials: true,
      });
      console.log(data); // Log the response to verify
      dispatch({ type: "GET_SINGLE_PERSON_ALL_BILL_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "GET_SINGLE_PERSON_ALL_BILL_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };
  const geSingleBill = async (id) => {
    try {
      dispatch({ type: "GET_SINGLE_BILL_REQUEST" });
      const { data } = await axios.get(`${API}/bill/${id}`, {
        withCredentials: true,
      });
      dispatch({ type: "GET_SINGLE_BILL_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "GET_SINGLE_BILL_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };
  

  return (
    <BillContext.Provider value={{ ...state, billGenerate,geVendorBillList,geSingleBill }}>
      {children}
    </BillContext.Provider>
  );
};

// custom hook

const useBillContext = () => {
  return useContext(BillContext);
};

export { BillContext, useBillContext, BillProvider };
