import React, { useEffect, useState } from "react";
import { Axios } from "../Utils/Axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await Axios({
        url:"/api/order/my-orders",
        method:"get"
      });

      setOrders(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state
  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Loading your orders...</p>
      </div>
    );

  //  Empty orders
  if (!orders || orders.length === 0)
    return (
      <div className="text-center mt-5">
        <h4 className="text-muted">You have no orders yet 🛒</h4>
      </div>
    );

  //  Status badge styling
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <span className="badge bg-success">Paid</span>;
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "failed":
        return <span className="badge bg-danger">Failed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 fw-bold text-success border-bottom pb-2">
        🛍 My Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="card mb-4 border-0 shadow-sm"
          style={{ borderRadius: "12px" }}
        >
          <div className="card-body">
            {/*  Order Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
              <h5 className="fw-bold mb-2 mb-md-0">
                Order #{order.orderId || order._id.slice(-6).toUpperCase()}
              </h5>
              {getStatusBadge(order.payment_status)}
            </div>

            {/*  Order Summary */}
            <div className="mb-2">
              <strong>Total:</strong>{" "}
              <span className="text-success fw-bold">
                {order.totalAmt} EGP
              </span>
            </div>
            <div className="mb-3 text-muted">
              <small>
                Ordered on:{" "}
                {new Date(order.createdAt).toLocaleDateString("en-EG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>

            {/*  Product List */}
            <div className="row g-3">
              {order.products.map((item, idx) => (
                <div key={idx} className="col-12 col-md-6">
                  <div
                    className="border rounded p-2 bg-light d-flex align-items-center shadow-sm"
                    style={{
                      borderRadius: "10px",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <img
                      src={item.product_details.image[0]}
                      alt={item.product_details.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "10px",
                      }}
                    />
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-1 text-truncate">
                        {item.product_details.name}
                      </p>
                      <p className="text-muted small mb-0">
                        Qty: <strong>{item.quantity}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
