import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div style={styles.nav}>
      <h3 style={{ color: "#fff" }}>Razorpay Clone</h3>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/payments" style={styles.link}>Payment History</Link>
      </div>
    </div>
  );
};

const styles = {
  nav: {
    height: "60px",
    background: "#02042B",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
  },
  link: {
    color: "#fff",
    marginLeft: "20px",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Navbar;
