import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./MuiAccordian.css";
import { NavLink } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const MuiAccordion = ({ curbill }) => {
  const [open, setOpen] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState([]); // Track selected payments

  const handleClose = () => setOpen(false); // Close the dialog

  const handleEmiClick = () => {
    if (curbill?.payments?.length > 0) {
      setSelectedPayments(curbill.payments); // Set all completed payments
    } else {
      setSelectedPayments([]); // No payments yet
    }
    setOpen(true);
  };
  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || "downloaded_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };



  const {
    billName = "N/A",
    billNumber = "N/A",
    createdAt = null,
    totalAmount = 0,
    emi = "N/A",
    status = "N/A",
    dueDate = "N/A",
    depositedAmount = 0,
    remainingBalance = 0,
    payments = [],
    uploadBill = null,
  } = curbill || {};

  const emiAmount =remainingBalance 
  const emiPerMonth = emiAmount / emi;

  const totalPaidAmount =
    depositedAmount + payments.reduce((a, b) => a + b.totalAmount, 0);

  const totalDueAmount = depositedAmount + (emiAmount - totalPaidAmount);

  let lastPaymentEmi = `0/${emi}`;
  let lastPaymentDueDate = dueDate;

  if (payments.length > 0) {
    const lastPayment = payments[payments.length - 1];
    lastPaymentEmi = `${lastPayment.paymentEmi}`;
    lastPaymentDueDate = lastPayment.nextDueDate;
  }

  const isEmiCompleted = payments.length === emi; 
  const billStatus = isEmiCompleted ? "Completed" : "Inprogress";

  return (
    <>
      <Accordion>
        <AccordionSummary
          className="accordionSummary"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>
            Bill Name & Bill No: {billName} & {billNumber}
          </Typography>
        </AccordionSummary>

        <AccordionDetails className="accordianDetails">
          {/* Section 1 */}
          <div className="section-1">
            <div className="section-1-1">
              <p>Date of Bill Generate</p>
              <p>Bill Name</p>
              <p>Bill Number</p>
              <p>Total Amount</p>
              <p>EMI</p>
              <p>EMI Amount Per Month</p>
              <p>Status</p>
            </div>

            <div className="section-1-2">
              <p>
                {createdAt
                  ? new Date(createdAt).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p>{billName}</p>
              <p>{billNumber}</p>
              <p>₹{totalAmount.toLocaleString()}</p>

              <NavLink>
                <p
                  onClick={handleEmiClick}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  {lastPaymentEmi}
                </p>
              </NavLink>

              <p>₹{Math.round(emiPerMonth).toLocaleString()}</p>
              <p style={{ color: isEmiCompleted ? "green" : "red" }}>
  <strong>{billStatus}</strong>
</p>

            </div>
          </div>

          {/* Section 2 */}
          <div className="section-2">
            <div className="section-2-1">
              <p>Total Paid Amount</p>
              <p>Total Due Amount</p>
              <p>Next Due Date</p>
              <p>Advance Paid</p>
              <p>Total EMI Amount</p>
              <p>Bill Details</p>
              <p>Update</p>
            </div>

            <div className="section-2-2">
              <p>₹{totalPaidAmount.toLocaleString()}</p>
              <p>₹{totalDueAmount.toLocaleString()}</p>
              <p>
                {lastPaymentDueDate
                  ? new Date(lastPaymentDueDate).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p>₹{depositedAmount.toLocaleString()}</p>
              <p>₹{emiAmount.toLocaleString()}</p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "12px",
                }}
              >
                <img
                  style={{ width: "15%" }}
                  src={uploadBill?.url}
                  alt=""
                  srcset=""
                />
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleDownload(uploadBill.url, `Bill_${billNumber}.png`)
                  }
                >
                  <strong>Download</strong>
                </button>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <NavLink
                  style={{ color: "black" }}
                  to={`/updatebill/${curbill?._id}`}
                >
                  <Tooltip title="Edit bill">
                    <EditOutlinedIcon fontSize="small" />
                  </Tooltip>
                </NavLink>
                <strong>Edit</strong>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Dialog for EMI Payment Details */}
      <Dialog onClose={handleClose} fullWidth open={open}>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography>Completed EMI Payments</Typography>
          <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
        </DialogTitle>

        <DialogContent className="contentContainer">
          {selectedPayments.length > 0 ? (
            selectedPayments.map((payment, index) => (
              <div
                key={index}
                className="contentBox"
                style={{ marginBottom: "10px" }}
              >
                <div className="content-1">
                  <p>EMI: {payment.paymentEmi}</p>
                </div>
                <div className="content-2">
                  <p>
                    Reference Number: <strong>{payment.referenceNumber}</strong>
                  </p>
                </div>
                <div className="content-3">
                  <p>Amount Paid: ₹{payment.totalAmount}</p>
                  <p>
                    Payment Date:{" "}
                    {new Date(payment.paymentDate).toLocaleDateString("en-GB")}
                  </p>
                  <p>Payment Mode: {payment.paymentMode}</p>
                  <p>Description: {payment.paymentDescription || "N/A"}</p>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <Typography>No EMI payments completed yet.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MuiAccordion;
