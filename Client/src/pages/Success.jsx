import React from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  const goToOrders = () => {
    navigate("/profile/my-orders");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        textAlign: "center",
        backgroundColor: "#f0f8ff",
        padding: "20px",
        borderRadius: "10px",
        margin: "50px auto",
        maxWidth: "500px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      }}
    >
      <h1 style={{ color: "#28a745", marginBottom: "20px" }}>
        Payment Successful ✅
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Thank you for your purchase! Your order has been placed successfully.
      </p>
      <button
        onClick={goToOrders}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "12px 25px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Go to My Orders
      </button>
    </div>
  );
};

export default Success;
