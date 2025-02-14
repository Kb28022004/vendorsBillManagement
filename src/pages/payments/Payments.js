import React, { useEffect, useState } from "react";
import "./Payments.css";
import { Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuthContextProvider } from "../../context/authContext";
import { useBillContext } from "../../context/billContext";
import { useNavigate, useParams } from "react-router-dom";
import { usePaymentContext } from "../../context/paymentContext";
import toast from "react-hot-toast";

const Payments = () => {
  const [loading, setLoading] = useState(false);
  const [emiOptions, setEmiOptions] = useState([]); // To store dynamic EMI options

  const [input, setInput] = useState({
    vendorId: "",
    billId: "",
    paymentDate: "",
    totalAmount: "",
    paymentMode: "",
    paymentEmi: "",
    referenceNumber: "",
    nextDueDate: "",
    paymentDescription: "",
    status: "",
  });
  const {
    vendorId,
    billId,
    paymentDate,
    totalAmount,
    paymentMode,
    paymentEmi,
    referenceNumber,
    nextDueDate,
    paymentDescription,
    status,
  } = input;

  const { vendors = [], getAllVendorsWithoutPagination } =
    useAuthContextProvider();
  const {
    error,
    makePayment,
    payments = [],
    getVendorBillsWithPayments,
  } = usePaymentContext();

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch vendors and bills on component mount
  useEffect(() => {
    getAllVendorsWithoutPagination();
    if (id) getVendorBillsWithPayments(id);

    if (error) {
      toast.error(error);
      setLoading(false);
    }
  }, [id, error]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // When vendorId changes
    if (name === "vendorId") {
      const currentDate = new Date().toISOString().split("T")[0]; // Get current date
      setInput((prev) => ({
        ...prev,
        [name]: value,
        billId: "",
        paymentDate: currentDate,
        referenceNumber: "", // Reset referenceNumber when vendor changes
      }));
      getVendorBillsWithPayments(value);
      setEmiOptions([]); // Reset EMI options when vendor changes
    }

    // When billId changes
    else if (name === "billId") {
      const selectedBill = payments.find((bill) => bill._id === value);
      if (selectedBill) {
        const emiCount = selectedBill.emi || 1;

        // Identify paid EMIs
        const paidEmis = selectedBill.payments
          .filter(
            (payment) =>
              payment.status === "InProcess" || payment.status === "Completed"
          )
          .map((payment) => payment.paymentEmi);

        // Find the next unpaid EMI
        let nextUnpaidEmi = null;
        for (let i = 1; i <= emiCount; i++) {
          const emiLabel = `${i}/${emiCount}`;
          if (!paidEmis.includes(emiLabel)) {
            nextUnpaidEmi = emiLabel;
            break;
          }
        }

        // Prepare EMI options
        const emiValues = Array.from({ length: emiCount }, (_, i) => {
          const label = `${i + 1}/${emiCount}`;
          return {
            label,
            isPaid: paidEmis.includes(label),
            isSelectable: label === nextUnpaidEmi, // Only the next unpaid EMI is selectable
          };
        });

        setEmiOptions(emiValues);

        // Auto-generate a reference number
        const referenceNumber = `REF-${selectedBill.billNumber}-${Date.now()}`;
        setInput((prev) => ({
          ...prev,
          [name]: value,
          referenceNumber, // Automatically set reference number
        }));
      }
    }

    // When paymentEmi changes
    else if (name === "paymentEmi") {
      const paymentDateObj = new Date(input.paymentDate); // Get the payment date
      if (!isNaN(paymentDateObj)) {
        // Add one month to the payment date
        const nextMonthDate = new Date(
          paymentDateObj.setMonth(paymentDateObj.getMonth() + 1)
        );

        // Check if the day of the next month exists
        if (nextMonthDate.getDate() !== paymentDateObj.getDate()) {
          // If not, set the next due date to the last day of the next month
          nextMonthDate.setDate(0);
        }

        const formattedNextDate = nextMonthDate.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
        setInput((prev) => ({
          ...prev,
          [name]: value,
          nextDueDate: formattedNextDate, // Automatically set next due date
          status: "InProcess", // Set status to In Process when EMI is selected
        }));
      } else {
        setInput((prev) => ({
          ...prev,
          [name]: value,
          status: "InProcess", // Set status to In Process when EMI is selected
        }));
      }
    }

    // Handle other inputs
    else {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !vendorId ||
      !billId ||
      !paymentDate ||
      !paymentEmi ||
      !paymentMode ||
      !totalAmount
    ) {
      toast.error("Kindly fill all the required credentials");
      return;
    }

    try {
      setLoading(true);
      const response = await makePayment({
        vendorId,
        billId,
        paymentDate,
        totalAmount,
        paymentMode,
        paymentEmi,
        referenceNumber,
        nextDueDate,
        paymentDescription,
        status,
      });

      if (response && response.success) {
        toast.success("Payment has been registered successfully");

        setInput({
          vendorId: "",
          billId: "",
          paymentDate: "",
          totalAmount: "",
          paymentMode: "",
          paymentEmi: "",
          referenceNumber: "",
          nextDueDate: "",
          paymentDescription: "",
          status: "",
        });
        setLoading(false);
        navigate(`/vendorprofile/${vendorId}`);
      } else {
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Unable to make payment, please try again");
      setLoading(false);
    }
  };

  return (
    <div className="paymentMainContainer">
      <div className="paymentContainer">
        <div className="upperSection">
          <p>Payment</p>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </div>
        <div className="lowerSection">
          <div className="personalDetailsSection">
            <form className="personalDetails">
              <div className="leftContainer">
                <div className="leftContainer-1">
                  <label>Vendor</label>
                  <select
                    value={vendorId}
                    name="vendorId"
                    onChange={handleChange}
                    placeholder="Select Vendor"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="leftContainer-1">
                  <label>Payment Date</label>
                  <input
                    value={paymentDate}
                    name="paymentDate"
                    onChange={handleChange}
                    type="date"
                    placeholder="Select Payment Date"
                    required
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={handleChange}
                    placeholder="Select Payment Mode"
                    name="paymentMode"
                    required
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="leftContainer-1">
                  <label>Reference Number</label>
                  <input
                    value={referenceNumber}
                    type="text"
                    onChange={handleChange}
                    name="referenceNumber"
                    placeholder="Enter Reference Number"
                    required
                  />
                </div>
                <div className="leftContainer-1">
                  <label>Payment Description</label>
                  <input
                    value={paymentDescription}
                    onChange={handleChange}
                    type="text"
                    name="paymentDescription"
                    placeholder="Enter Payment Description"
                  />
                </div>
              </div>
              <div className="rightContainer">
                <div className="rightContainer-1">
                  <label>Bill Number</label>
                  <select
                    value={billId}
                    onChange={handleChange}
                    name="billId"
                    required
                  >
                    <option value="">Select Bill</option>
                    {payments.map((bill) => (
                      <option key={bill._id} value={bill._id}>
                        {bill.billNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rightContainer-1">
                  <label>Total Amount</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={handleChange}
                    name="totalAmount"
                    placeholder="Enter Total Amount"
                    required
                  />
                </div>
                <div className="rightContainer-1">
                  <label>Payment EMI</label>
                  <select
                    name="paymentEmi"
                    value={paymentEmi}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select EMI</option>
                    {emiOptions.map((emi, index) => (
                      <option
                        key={index}
                        value={emi.label}
                        disabled={emi.isPaid || !emi.isSelectable}
                      >
                        {emi.label}{" "}
                        {emi.isPaid
                          ? "(Paid)"
                          : emi.isSelectable
                          ? ""
                          : "(Locked)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rightContainer-1">
                  <label>Next Due Date</label>
                  <input
                    type="date"
                    name="nextDueDate"
                    value={nextDueDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="rightContainer-1">
                  <label>Status</label>
                  <select value={status} name="status" onChange={handleChange}>
                    <option value="">Select Status</option>
                    <option value="InProcess">In Process</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </form>
            <div className="actionContainer">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="createVendorBtn"
                variant="contained"
              >
                {loading ? <CircularProgress size={18} /> : "Submit Payment"}
              </Button>
              <Button
                onClick={() => window.history.back()}
                className="cancelBtn"
                variant="outlined"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
