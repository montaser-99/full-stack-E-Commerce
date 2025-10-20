import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <div className="p-5 bg-white rounded shadow" style={{ maxWidth: "500px" }}>
        <h1 className="text-danger mb-4">Payment Cancelled ❌</h1>
        <p className="mb-4">
          Your payment was not completed. You can try again or return to the homepage.
        </p>
        <button className="btn btn-primary btn-lg" onClick={goHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Cancel;
