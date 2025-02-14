import React, { useEffect, useState } from "react";
import "./BillGenerates.css";
import { Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuthContextProvider } from "../../context/authContext";
import { useBillContext } from "../../context/billContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // Install dayjs: npm install dayjs

const BillGenerates = () => {
  const [input, setInput] = useState({
    vendorId: "",
    billName: "",
    billNumber: "",
    paymentMode: "",
    status: "",
    totalAmount: "",
    emi: "",
    depositedAmount: "",
    dueDate: "",
    remainingBalance: "",
    referenceNumber: "",
    emiPaymentMode: "",
    uploadBill: null, // This is for the file upload
  });

  const [loading, setloading] = useState(false);

  const {
    vendorId,
    billName,
    billNumber,
    paymentMode,
    status,
    totalAmount,
    emi,
    depositedAmount,
    dueDate,
    remainingBalance,
    referenceNumber,
    emiPaymentMode,
    uploadBill,
  } = input;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setInput((prev) => ({ ...prev, [name]: files[0] })); // Update file state
    } else {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const navigate = useNavigate();

  const { vendors, getAllVendorsWithoutPagination } = useAuthContextProvider();
  const { billGenerate, error } = useBillContext();

  useEffect(() => {
    getAllVendorsWithoutPagination();

    if (error) {
      toast.error(error);
      setloading(false);
    }
  }, [error]);

  // Automatically generate bill name and bill number based on selected vendor
  useEffect(() => {
    if (vendorId) {
      const selectedVendor = vendors.find((vendor) => vendor._id === vendorId);
      if (selectedVendor) {
        const generatedBillName = `${selectedVendor.name}-Bill`;
        const generatedBillId = `${Math.floor(Math.random() * 1000000)}`;

        setInput((prev) => ({
          ...prev,
          billName: generatedBillName,
          billNumber: generatedBillId,
        }));
      }
    }
  }, [vendorId, vendors]);

  // Generate reference number when payment mode changes to "Online"
  useEffect(() => {
    if (paymentMode === "Online") {
      const generatedReferenceNumber = `REF-${Math.floor(
        Math.random() * 1000000
      )}`;
      setInput((prev) => ({
        ...prev,
        referenceNumber: generatedReferenceNumber,
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        referenceNumber: "",
      }));
    }
  }, [paymentMode]);

  // Calculate remaining balance when depositedAmount or totalAmount changes
  useEffect(() => {
    if (totalAmount && depositedAmount) {
      const calculatedRemainingBalance = totalAmount - depositedAmount;

      setInput((prev) => ({
        ...prev,
        remainingBalance:
          calculatedRemainingBalance >= 0 ? calculatedRemainingBalance : 0,
      }));
    }
  }, [totalAmount, depositedAmount]);

  // Automatically calculate next due date based on EMI
  useEffect(() => {
    if (emi) {
      const today = dayjs(); // Get today's date
      const nextDueDate = today.add(1, "month").format("YYYY-MM-DD"); // Add one month for next EMI

      setInput((prev) => ({
        ...prev,
        dueDate: nextDueDate,
        status: "Process",
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        dueDate: "",
        status: ""
      }));
    }
  }, [emi]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId || !billName || !billNumber || !totalAmount) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setloading(true);

      // Prepare form data for submission
      const formData = new FormData();
      formData.append("vendorId", vendorId);
      formData.append("billName", billName);
      formData.append("billNumber", billNumber);
      formData.append("paymentMode", paymentMode);
      formData.append("status", status);
      formData.append("totalAmount", totalAmount);
      formData.append("emi", emi);
      formData.append("depositedAmount", depositedAmount);
      formData.append("dueDate", dueDate);
      formData.append("remainingBalance", remainingBalance);
      formData.append("referenceNumber", referenceNumber);
      formData.append("emiPaymentMode", emiPaymentMode);
      if (uploadBill) {
        formData.append("uploadBill", uploadBill); // Append the file
      }

      // Submit the form data
      const response = await billGenerate(formData);

      if (response && response.success) {
        toast.success("Bill has been generated");
        setInput({
          vendorId: "",
          billName: "",
          billNumber: "",
          paymentMode: "",
          status: "",
          totalAmount: "",
          emi: "",
          depositedAmount: "",
          dueDate: "",
          remainingBalance: "",
          referenceNumber: "",
          emiPaymentMode: "",
          uploadBill: null,
        });

        navigate("/vendordetails");
        setloading(false);
      }
    } catch (error) {
      toast.error("Unable to generate a bill, please try again later");
      setloading(false);
    }
  };

  return (
    <div className="billGenerateMainContainer">
      <div className="billGenerateContainer">
        <div className="upperSection">
          <p>Bill Generate</p>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </div>
        <div className="lowerSection">
          <form className="personalDetailsSection" onSubmit={handleSubmit}>
            <div className="personalDetails">
              <div className="leftContainer">
                <div className="left-container--1">
                  <label>Vendor</label>
                  <select
                    name="vendorId"
                    value={vendorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Vendor</option>
                    {vendors &&
                      vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="left-container--1">
                  <label>Bill Number</label>
                  <input
                    type="text"
                    placeholder="Bill Number"
                    name="billNumber"
                    value={billNumber}
                    readOnly
                  />
                </div>
                <div className="left-container--1">
                  <label>Deposited Amount</label>
                  <input
                    type="number"
                    required
                    placeholder="Enter Deposited Amount"
                    name="depositedAmount"
                    value={depositedAmount}
                    onChange={handleChange}
                  />
                </div>
                <div className="left-container--1">
                  <label>Payment Mode</label>
                  <select
                    name="paymentMode"
                    value={paymentMode}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div className="left-container--1">
                  <label>EMI</label>
                  <select name="emi" value={emi} onChange={handleChange}>
                    <option value="">Select EMI</option>
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                  </select>
                </div>
                <div className="left-container--1">
                  <label>Next Emi Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={dueDate}
                    readOnly
                  />
                </div>
                <div className="left-container--1">
                  <label>Status</label>
                  <select name="status" value={status} onChange={handleChange}>
                    <option value="">Select Status</option>
                    <option value="Process">Process</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="rightContainer">
                <div className="right-container--1">
                  <label>Bill Name</label>
                  <input
                    type="text"
                    name="billName"
                    value={billName}
                    readOnly
                  />
                </div>
                <div className="right-container--1">
                  <label>Total Amount</label>
                  <input
                    type="number"
                    name="totalAmount"
                    placeholder="Enter Total Amount"
                    value={totalAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="right-container--1">
                  <label>Remaining Balance</label>
                  <input
                    type="number"
                    placeholder="Remaining Balance"
                    name="remainingBalance"
                    value={remainingBalance}
                    readOnly
                  />
                </div>
                {paymentMode === "Online" && (
                  <div className="right-container--1">
                    <label>Reference Number</label>
                    <input
                      type="text"
                      name="referenceNumber"
                      placeholder="Enter Reference Number"
                      value={referenceNumber}
                      onChange={handleChange}
                    />
                  </div>
                )}
                <div className="right-container--1">
                  <label>EMI Payment Mode</label>
                  <select
                    name="emiPaymentMode"
                    value={emiPaymentMode}
                    onChange={handleChange}
                  >
                    <option value="">Select EMI Payment Mode</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="right-container--1">
                  <label>Upload Bill</label>
                  <input
                    style={{ padding: "5px" }}
                    type="file"
                    name="uploadBill"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="actionContainer">
              <Button
                disabled={loading}
                className="createVendorBtn"
                variant="contained"
                type="submit"
              >
                {loading ? <CircularProgress  size={18} /> : "Bill Generate"}
              </Button>
              <Button
                onClick={handleBack}
                className="cancelBtn"
                variant="outlined"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillGenerates;
