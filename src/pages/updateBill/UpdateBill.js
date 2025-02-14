import React, { useEffect, useState } from "react";
import "./UpdateBill.css";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useBillContext } from "../../context/billContext";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContextProvider } from "../../context/authContext";

const UpdateBill = () => {
  const [input, setinput] = useState({
    vendorId: "",
    billNumber: "",
    paidDate: "",
    amount: "",
    emi: "",
    amountPaid: "",
    referenceNumber: "",
    nextDueDate: "",
    paymentDescription: "",
    status: "",
    file: null,
    emiMonths: 12, // Default EMI months to 12 if not specified
  });
  const [emiMonths, setEmiMonths] = useState(0); // State to store EMI months

  const { geSingleBill, bill = {} } = useBillContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const {getAllVendors,vendors=[]}=useAuthContextProvider()

  // Fetch vendor bill data when the component mounts
  useEffect(() => {
    geSingleBill(id);
  }, [id]);

  // Pre-fill the form when the bill data is fetched
  useEffect(() => {
    if (bill) {
      setinput({
        vendorId: bill.vendor || "",
        billNumber: bill.billNumber || "",
        amount: bill.totalAmount || "",
        status: bill.status || "",
        emiMonths: bill.emi , // Default EMI months to 12 if no paid EMI data
      });
      setEmiMonths(bill.emi ); // Default to 12 if no EMI info available
    }
  }, [bill]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setinput({
      ...input,
      [name]: value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setinput({
      ...input,
      file: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Bill Data:", input);

    // You can call an API or context function to update the bill here

    // After the update, you can navigate back to the previous page or show a success message
    navigate(-1);
  };

  // Generate EMI options dynamically based on the number of months
  const generateEmiOptions = () => {
    const options = [];
    if (emiMonths > 0) {
      for (let i = 1; i <= emiMonths; i++) {
        options.push(`${i}/${emiMonths}`);
      }
    }
    return options;
  };

  return (
    <div className="billUpdateMainContainer">
      <div className="billUpdateContainer">
        <div className="upperSection">
          <p>Bill Name & ID :- </p>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)} // Navigate back
          >
            Back
          </Button>
        </div>
        <div className="lowerSection">
          <form className="personalDetailsSection" onSubmit={handleSubmit}>
            <div className="personalDetails">
              <div className="leftContainer">
                <div className="leftContainer-1">
                  <label>Vendor</label>
                  <select
                    name="vendorId"
                    value={input.vendorId}
                    onChange={handleChange}
                    required
                    placeholder="Select Vendor"
                  >
                    <option value="">Select Vendor</option>
                    {/* Populate vendor options dynamically */}
                  </select>
                </div>
                <div className="leftContainer-1">
                  <label>Paid Date</label>
                  <input
                    type="date"
                    required
                    placeholder="Enter Paid Date"
                    name="paidDate"
                    value={input.paidDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Paid EMI</label>
                  <select
                    name="emi"
                    value={input.emi}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Paid EMI</option>
                    {generateEmiOptions().map((emiOption, index) => (
                      <option key={index} value={emiOption}>
                        {emiOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="leftContainer-1">
                  <label>Reference Number</label>
                  <input
                    required
                    type="text"
                    name="referenceNumber"
                    value={input.referenceNumber}
                    onChange={handleChange}
                    placeholder="Enter Reference Number"
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Payment Description</label>
                  <input
                    required
                    type="text"
                    name="paymentDescription"
                    value={input.paymentDescription}
                    onChange={handleChange}
                    placeholder="Enter Payment Description"
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Status</label>
                  <select
                    name="status"
                    value={input.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Online">Activate</option>
                    <option value="Offline">Deactivate</option>
                  </select>
                </div>
              </div>
              <div className="rightContainer">
                <div className="rightContainer-1">
                  <label>Bill Number</label>
                  <input
                    type="number"
                    required
                    name="billNumber"
                    value={input.billNumber}
                    onChange={handleChange}
                    placeholder="Enter Bill Number"
                  />
                </div>
                <div className="rightContainer-1">
                  <label>Amount</label>
                  <input
                    type="number"
                    required
                    name="amount"
                    value={input.amount}
                    onChange={handleChange}
                    placeholder="Enter Total Amount"
                  />
                </div>
                <div className="rightContainer-1">
                  <label>Amount Paid</label>
                  <input
                    type="number"
                    name="amountPaid"
                    value={input.amountPaid}
                    onChange={handleChange}
                    placeholder="Enter Amount Paid"
                  />
                </div>
                <div className="rightContainer-1">
                  <label>Next Due Date</label>
                  <input
                    type="date"
                    required
                    name="nextDueDate"
                    value={input.nextDueDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="rightContainer-1">
                  <label>Upload Bill</label>
                  <input
                    style={{ padding: "5px" }}
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="actionContainer">
              <Button className="createVendorBtn" variant="contained" type="submit">
                Update
              </Button>
              <Button
                className="cancelBtn"
                variant="outlined"
                onClick={() => navigate(-1)} // Navigate back
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

export default UpdateBill;
