import { createContext, useContext, useReducer } from "react";
import reducer from "../reducer/paymentReducer";
import axios from "axios";

const PaymentContext = createContext();
const API = "http://localhost:8000/api/v1/payment";

const initialState = {
  loading: false,
  error: null,
  payment: {},
  payments:[],
  vendors:[]

};

const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const makePayment = async (paymentDetails) => {
    try {
      dispatch({ type: "MAKE_PAYMENT_REQUEST" });
      const { data } = await axios.post(`${API}/create`, paymentDetails, {
        withCredentials: true,
        headers: {
          "Content-Length": "application/json",
        },
      });
      dispatch({ type: "MAKE_PAYMENT_SUCCESS", payload: data });
      return{success:true}
    } catch (error) {
      dispatch({
        type: "MAKE_PAYMENT_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  // get single vendor bill's payments

  const getVendorBillsWithPayments=async(id)=>{
    try {
      dispatch({type:"GET_VENDOR_BILL_PAYMENTS_REQUEST"})
      const {data}=await axios.get(`${API}/vendor/${id}/bills-with-payments`,
       { withCredentials:true}
      )
      dispatch({type:"GET_VENDOR_BILL_PAYMENTS_SUCCESS",payload:data})
    } catch (error) {
      dispatch({type:"GET_VENDOR_BILL_PAYMENTS_FAIL",payload:error.response?.data?.message})
    }
  }

  const getVendorSBillsWithPayments=async()=>{
    try {
      dispatch({type:"GET_VENDORS_BILL_PAYMENTS_REQUEST"})
      const {data}=await axios.get(`${API}/vendors-with-all-bills-payment`,
       { withCredentials:true}
      )
      dispatch({type:"GET_VENDORS_BILL_PAYMENTS_SUCCESS",payload:data})
    } catch (error) {
      dispatch({type:"GET_VENDORS_BILL_PAYMENTS_FAIL",payload:error.response?.data?.message})
    }
  }

  return (
    <PaymentContext.Provider value={{ ...state, makePayment,getVendorBillsWithPayments,getVendorSBillsWithPayments }}>
      {children}
    </PaymentContext.Provider>
  );
};

// custom hook

const usePaymentContext = () => {
  return useContext(PaymentContext);
};

export { usePaymentContext, PaymentContext, PaymentProvider };
