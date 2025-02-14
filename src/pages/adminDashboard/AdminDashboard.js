import React, { useEffect } from "react";
import "./AdminDashboard.css";
import Card from "../../helper/card/Card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { usePaymentContext } from "../../context/paymentContext";

const AdminDashboard = ({ text, numericalValue }) => {
  const { vendors = [], getVendorSBillsWithPayments } = usePaymentContext();
  console.log(vendors);

  useEffect(() => {
    getVendorSBillsWithPayments();
  }, []);

  const paymentData = [
    { date: "20 Jan", amount: 1000 },
    { date: "21 Jan", amount: 5000 },
    { date: "22 Jan", amount: 3000 },
    { date: "23 Jan", amount: 10000 },
    { date: "24 Jan", amount: 15000 },
    { date: "25 Jan", amount: 8000 },
    { date: "26 Jan", amount: 12000 },
  ];

  const dueData = [
    { date: "20 Jan", amount: 30000 },
    { date: "21 Jan", amount: 28000 },
    { date: "22 Jan", amount: 25000 },
    { date: "23 Jan", amount: 27000 },
    { date: "24 Jan", amount: 30000 },
    { date: "25 Jan", amount: 29000 },
    { date: "26 Jan", amount: 35000 },
  ];
  const totalEmiPayment =
    vendors
      .map((vendor) =>
        vendor.bills.map((bill) =>
          bill.payments.reduce(
            (accu, payment) => accu + (payment.totalAmount || 0),
            0
          )
        )
      )
      .flat() // Flatten the array to get a single array of all payments
      .reduce((accu, payment) => accu + payment, 0) || 0;

  const totalDepositedAmount =
    vendors
      .map((vendor) =>
        vendor.bills.reduce(
          (accu, bill) => accu + (bill.depositedAmount || 0),
          0
        )
      )
      .reduce((accu, amount) => accu + amount, 0) || 0;

  const totalAmount =
    vendors
      .map((vendor) =>
        vendor.bills.reduce((accu, bill) => accu + (bill.totalAmount || 0), 0)
      )
      .reduce((accu, amount) => accu + amount, 0) || 0;

  const totalRemainingBalance =
    vendors
      .map((vendor) =>
        vendor.bills.reduce(
          (accu, bill) => accu + (bill.remainingBalance || 0),
          0
        )
      )
      .reduce((accu, amount) => accu + amount, 0) || 0;

  const emiTotalAmount =
    totalRemainingBalance 

  const totalDuePayment = emiTotalAmount - totalEmiPayment;

  const totalPayment = totalDepositedAmount + totalEmiPayment;

  const today = new Date(); // Get today's date

const totalMissedPayments = vendors
  .map((vendor) =>
    vendor.bills
      .map((bill) =>
        bill.payments.filter((payment) => {
          const dueDate = new Date(bill.nextDueDate); // Convert due date to Date object
          const paymentDate = new Date(payment.paymentDate); // Convert payment date to Date object
          return paymentDate > dueDate; // Count if payment is made late
        }).length
      )
      .reduce((accu, count) => accu + count, 0) // Sum missed payments per vendor
  )
  .reduce((accu, count) => accu + count, 0) || 0; // Sum across all vendors


  return (
    <div className="adminDashboardContainer">
      <div className="card">
        <div className="card1">
          <Card
            text="Total Payment"
            numericalValue={`₹${totalPayment.toLocaleString() || 0} `}
          />
        </div>
        <div className="card2">
          <Card
            text="Total Due"
            numericalValue={`₹${totalDuePayment.toLocaleString() || 0}`}
          />
        </div>
        <div className="card3">
          <Card text="Total Vendors" numericalValue={vendors.length} />
        </div>
        <div className="card4">
          <Card text="Total Lapsed Payment" numericalValue={totalMissedPayments} />
        </div>
      </div>
      <div className="graph">
        <div className="paymentRecieve">
          <div className="paymentFilterMonth">
            <div className="paymentTitle">
              <h3>Payment Receive</h3>
            </div>
            <select>
              <option>Current Month</option>
              <option>Previous Month</option>
            </select>
          </div>
          <div>
            <LineChart
              width={400}
              height={250}
              data={paymentData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                dot={{ fill: "black", r: 5 }}
              />
            </LineChart>
          </div>
        </div>
        <div className="paymentDue">
          <div className="paymentDueFilterMonth">
            <div className="paymentTitle">
              <h3>Payment Due</h3>
            </div>
            <select>
              <option>Current Month</option>
              <option>Previous Month</option>
            </select>
          </div>
          <div>
            <AreaChart
              width={400}
              height={250}
              data={dueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
