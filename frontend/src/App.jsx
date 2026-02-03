
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

// Payment Page (Home)
const Home = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const orderRes = await axios.post(
        "http://localhost:5001/api/payment/create-order",
        { amount }
      );

      const order = orderRes.data;

      const options = {
        key: "rzp_test_SAu8KP4lSLsJr1", // 🔑 Key ID
        amount: order.amount,
        currency: "INR",
        name: "Razorpay Clone",
        description: "Secure Payment",
        order_id: order.id,

        handler: async function (response) {
          await axios.post("http://localhost:5001/api/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: amount,
          });

          alert("Payment Successful 🎉");
        },

        theme: { color: "#0f4fff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src="https://razorpay.com/assets/razorpay-glyph.svg"
          alt="razorpay"
          style={styles.logo}
        />
        <h2 style={styles.heading}>Complete your payment</h2>
        <input
          type="number"
          placeholder="Enter amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />
        <button onClick={handlePayment} disabled={loading} style={styles.button}>
          {loading ? "Processing..." : `Pay ₹${amount || ""}`}
        </button>
        <p style={styles.secure}>🔒 100% Secure Payments</p>
      </div>
    </div>
  );
};

// PaymentHistory Page
const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/payment/history");
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useState(() => {
    fetchPayments();
  }, []);

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Payment History</h2>
      {payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p.razorpay_payment_id}</td>
                <td>{p.razorpay_order_id}</td>
                <td>{p.amount}</td>
                <td>{p.status}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const tableStyles = {
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
  },
};

const App = () => {
  return (
    <Router>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logoNav}>Razorpay Clone</div>
        <div>
          <Link style={styles.navLink} to="/">Home</Link>
          <Link style={styles.navLink} to="/payments">Payment History</Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payments" element={<PaymentHistory />} />
      </Routes>
    </Router>
  );
};

// Styles
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 40px",
    background: "#0f1441",
    color: "#fff",
  },
  logoNav: { fontWeight: "700" },
  navLink: {
    marginLeft: "20px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: "500",
  },
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px",
    width: "360px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  logo: { width: "50px", marginBottom: "10px" },
  heading: { marginBottom: "20px", fontWeight: "600" },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #dcdcdc",
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    background: "#0f4fff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  secure: { marginTop: "15px", fontSize: "13px", color: "#666" },
};

export default App;
