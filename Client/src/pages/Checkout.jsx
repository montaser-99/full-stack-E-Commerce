import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import AddressList from "../components/AddressList";
import { Axios } from "../Utils/Axios";
import { useNavigate } from "react-router-dom";
import { displaydiscount } from "../Utils/Displaypricediscount";
import { fetchCartItem } from "../store/cartSlice";

function Checkout() {
  const cartList = useSelector((state) => state.cart.cart);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalOriginalPrice = cartList.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const totalAmount = cartList.reduce((acc, item) => {
    const discountedPrice = displaydiscount(
      item.productId.price,
      item.productId.discount
    );
    return acc + discountedPrice * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error("Please select an address");

    const items = cartList.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    try {
      const res = await Axios({
        url: "/api/order/cash",
        method: "post",
        data: {
          addressId: selectedAddress._id,
          list_items: items,
        },
        withCredentials: true,
      });

      console.log(res);

      if (res.data.success) {
        toast.success("Order placed successfully");
        dispatch(fetchCartItem());
        navigate("/profile/my-orders");
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  const handleOnlinePayment = async () => {
    if (!selectedAddress) return toast.error("Please select an address");

    const items = cartList.map((item) => ({
      product_details: {
        name: item.productId.name,
        image: item.productId.image[0],
      },
      price: item.productId.price,
      quantity: item.quantity,
    }));

    try {
      const res = await Axios({
        url: "/api/order/online-payment",
        method: "post",
        data: { cartItems: items, addressId: selectedAddress._id },
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to redirect to payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error processing online payment");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">Checkout</h2>
      <div className="row g-4">
        {/* Left Side - Address Selection */}
        <div className="col-lg-7 col-md-12">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2">
              Select Delivery Address
            </h5>
            <AddressList
              mode="select"
              onSelect={(address) => setSelectedAddress(address)}
            />
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="col-lg-5 col-md-12">
          <div
            className="card border-0 shadow-sm p-4 sticky-top"
            style={{ top: "100px" }}
          >
            <h5 className="fw-bold mb-3 border-bottom pb-2">Order Summary</h5>

            {cartList.map((item) => {
              const originalPrice = item.productId.price * item.quantity;
              const discountedPrice =
                displaydiscount(item.productId.price, item.productId.discount) *
                item.quantity;

              return (
                <div
                  key={item._id}
                  className="d-flex justify-content-between align-items-center mb-3"
                >
                  <div>
                    <div className="fw-semibold">{item.productId.name}</div>
                    <small className="text-muted">Qty: {item.quantity}</small>
                    <div>
                      <small className="text-decoration-line-through text-muted me-2">
                        ${originalPrice.toFixed(2)}
                      </small>
                      <span className="fw-bold text-success">
                        ${discountedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <img
                    src={item.productId.image[0]}
                    alt={item.productId.name}
                    className="rounded border"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              );
            })}

            <hr />

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${totalOriginalPrice.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Discount:</span>
              <span className="text-success">
                -${(totalOriginalPrice - totalAmount).toFixed(2)}
              </span>
            </div>

            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Total:</span>
              <span className="text-success">${totalAmount.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary w-100 py-2 mb-2 fw-semibold"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress}
            >
              Place Order (Cash on Delivery)
            </button>

            <button
              className="btn btn-success w-100 py-2 fw-semibold"
              onClick={handleOnlinePayment}
              disabled={!selectedAddress}
            >
              Pay Online 💳
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
