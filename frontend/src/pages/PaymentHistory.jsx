import { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/payment/history"
      );

      // 🔥 IMPORTANT FIX
      setPayments(res.data); // NOT res.data.payments
    } catch (err) {
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Payment History</h2>

      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>Amount (₹)</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="6" align="center">
                No payments found
              </td>
            </tr>
          ) : (
            payments.map((p, index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td>{p.razorpay_payment_id}</td>
                <td>{p.razorpay_order_id}</td>
                <td>₹ {p.amount}</td>
                <td>{p.status}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentHistory;
