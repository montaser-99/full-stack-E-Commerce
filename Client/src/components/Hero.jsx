import React from "react";

function Hero() {
  return (
    <div
      className="container-fluid mt-3 p-0"
      style={{
        backgroundImage: "url(/assets/banner.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "80vh",
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      ></div>

      
      <div
        className="d-flex flex-column justify-content-center align-items-center text-white text-center h-100 position-relative px-3"
        style={{ zIndex: 2 }}
      >
        <h1 className="display-4 fw-bold mb-3">Discover Your Style</h1>
        <p className="lead mb-4">
          Shop the latest trends and exclusive offers just for you.
        </p>
        <a
          href="#our-category"
          className="btn btn-light btn-lg px-4 fw-semibold"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}

export default Hero;
