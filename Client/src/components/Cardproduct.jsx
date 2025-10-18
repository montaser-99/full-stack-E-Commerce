import React from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./Addtocartbutton";
import { displaydiscount } from "../Utils/Displaypricediscount";

function Cardproduct({ data }) {
  const finalPrice = displaydiscount(data.price, data.discount);

  return (
    <div
      className="card product-card h-100 border-0 rounded-4 shadow-sm overflow-hidden bg-white"
      style={{
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
    >

      {data.discount > 0 && (
        <span
          className="badge bg-danger position-absolute top-0 end-0 m-2 px-3 py-2 shadow-sm"
          style={{ fontSize: "0.8rem", borderRadius: "8px" }}
        >
          -{data.discount}%
        </span>
      )}


      <Link
        to={`/product-details/${data._id}`}
        className="text-decoration-none text-dark"
      >
        <div
          className="d-flex justify-content-center align-items-center bg-light p-3"
          style={{
            height: "200px",
            borderBottom: "1px solid #eee",
          }}
        >
          <img
            src={data.image[0]}
            alt={data.name}
            className="img-fluid"
            style={{
              maxHeight: "160px",
              objectFit: "contain",
              transition: "transform 0.3s ease",
            }}
          />
        </div>


        <div className="card-body text-center px-2">
          <h6
            className="fw-semibold text-truncate mb-2"
            title={data.name}
            style={{ fontSize: "1rem", lineHeight: "1.4" }}
          >
            {data.name}
          </h6>

          <div className="mb-2">
            <span className="fw-bold text-success me-2">
              ${finalPrice}
            </span>
            {data.discount > 0 && (
              <span className="text-muted text-decoration-line-through small">
                ${data.price}
              </span>
            )}
          </div>

          <div>
            {data.stock > 0 ? (
              <span className="badge bg-success-subtle text-success border border-success">
                In Stock
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger border border-danger">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>


      <div className="px-3 pb-3">
        <AddToCartButton product={data} />
      </div>


      <style>
        {`
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
          }
          .product-card:hover img {
            transform: scale(1.05);
          }
          .bg-success-subtle {
            background-color: rgba(0, 202, 87, 0.1) !important;
          }
          .bg-danger-subtle {
            background-color: rgba(255, 0, 0, 0.1) !important;
          }
        `}
      </style>
    </div>
  );
}

export default Cardproduct;
