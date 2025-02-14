import React, { useEffect } from "react";
import "./VendorProfile.css";
import { Avatar } from "@mui/material";
import MuiAccordion from "../../helper/accordian/MuiAccordian";
import { useAuthContextProvider } from "../../context/authContext";
import { useParams } from "react-router-dom";
import Loader from "../../helper/loader/Loader";
import toast from "react-hot-toast";
import { usePaymentContext } from "../../context/paymentContext";

const VendorProfile = () => {
  const {
    vendor = {},
    getSingleVendorDetails,
    loading,
    error,
  } = useAuthContextProvider();
  const { getVendorBillsWithPayments, payments = [] } = usePaymentContext();

  const { id } = useParams();

  useEffect(() => {
    getSingleVendorDetails(id);
    getVendorBillsWithPayments(id);

    if (error) {
      toast.error(error);
    }
  }, [id, error]);

  const totalAmountPaid = payments.reduce((acc, curPayment) => {
    const paymentTotal = curPayment.payments.reduce(
      (sum, curElem) => sum + curElem.totalAmount,
      0
    );
    return acc + paymentTotal + curPayment.depositedAmount;
  }, 0);

  const totalDepositedAmount = payments.reduce((acc, curElem) => {
    return acc + curElem.depositedAmount;
  }, 0);

  const remainingBalance = payments.reduce((acc, curElem) => {
    return acc + curElem.remainingBalance;
  }, 0);

  const totalAmount = payments.reduce((acc, curElem) => {
    return acc + curElem.totalAmount;
  }, 0);

  const emiTotalAmount =
    remainingBalance 

  const totalDueAmount =
    totalDepositedAmount + (emiTotalAmount - totalAmountPaid);

  // ✅ Calculate Completed Transactions
  const completedTransactions = payments.filter(
    (curPayment) => curPayment.payments.length === curPayment.emi
  ).length;

  // ✅ Calculate In-progress Transactions
  const inProgressTransactions = payments.length - completedTransactions;

  return (
    <div className="vendorProfileContainer">
      {loading ? (
        <Loader />
      ) : (
        <div className="vendorProfileSection">
          <div className="personalDetails">
            <div className="section-1">
              <Avatar
                src={
                  vendor.profilePicture?.url ||
                  "https://via.placeholder.com/150"
                }
                alt={vendor.name || "No Profile Picture"}
                className="profileImage"
              />

              <p className="vendorName">{vendor.name}</p>
              <div className="vendorId">
                <p>ID : {vendor._id}</p>
              </div>
            </div>

            <div className="section-2">
              <div className="section-2-1">
                <div className="section-2-1-1">
                  <p>Contact No.</p>
                </div>
                <div className="section-2-1-2">
                  <p>Email</p>
                </div>
              </div>

              <div className="section-2-2">
                <div className="section-2-2-1">
                  <p>+91 {vendor.phone}</p>
                </div>
                <div className="section-2-1-2">
                  <p>{vendor.email}</p>
                </div>
              </div>
            </div>

            <div className="section-3">
              <div className="leftSection">
                <p>Address:</p>
                <p>Total Amount Due:</p>
                <p>Total Payment:</p>
                <p>Date of Joining:</p>
                <p>Total Transaction:</p>
                <p>Complete Trxn:</p>
                <p>Inprogress Trxn:</p>
              </div>

              <div className="rightSection">
                <p>{vendor.address || "N/A"}</p>
                <p>
                  <strong>₹{totalDueAmount.toLocaleString() || "N/A"}</strong>
                </p>
                <p>
                  <strong>₹{totalAmountPaid.toLocaleString() || "N/A"}</strong>
                </p>
                <p>{new Date(vendor.createdAt).toLocaleDateString("en-GB")}</p>
                <p>{payments.length}</p>

                {/* ✅ Show Completed and In-Progress Transactions */}
                <p>{completedTransactions || "0"}</p>
                <p>{inProgressTransactions || "0"}</p>
              </div>
            </div>
          </div>

          <div className="billDetails">
            {payments && payments.length > 0 ? (
              payments.map((curbill) => (
                <MuiAccordion key={curbill._id} curbill={curbill} />
              ))
            ) : (
              <p>No bills available for this vendor.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;
