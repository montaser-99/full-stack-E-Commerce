import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { fetchCartItem } from '../store/cartSlice';
import { FaArrowUp, FaArrowDown, FaTrashAlt } from 'react-icons/fa';
import { displaydiscount } from '../Utils/Displaypricediscount';

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.cart);

  const subtotal = cart.reduce((acc, item) => {
    const discountedPrice = displaydiscount(item.productId.price, item.productId.discount);
    return acc + discountedPrice * item.quantity;
  }, 0);

  const shipping = 50;
  const total = subtotal + shipping;

  const updateCartQty = async (cartItemId, newQuantity) => {
    try {
      await Axios({
        url: SummaryApi.UpdateCart.url,
        method: SummaryApi.UpdateCart.method,
        data: { _id: cartItemId, qty: newQuantity }
      });
      dispatch(fetchCartItem());
    } catch (err) {
      console.log(err);
      toast.error("Error updating quantity");
    }
  };

  const deleteCartItem = async (cartItemId) => {
    try {
      await Axios({
        url: SummaryApi.DeleteCart.url,
        method: SummaryApi.DeleteCart.method,
        data: { _id: cartItemId }
      });
      toast.success("Item removed from cart");
      dispatch(fetchCartItem());
    } catch (error) {
      toast.error("Failed to delete item");
      console.log(error);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="container text-center py-5">
        <h2 className="display-5 fw-bold mb-4">Your Cart is Empty 🛒</h2>
        <Link to="/" className="btn btn-dark px-4 py-2">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Shopping Cart</h2>

      <div className="table-responsive shadow-sm rounded">
        <table className="table align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {cart.map((item) => {
              const discountedPrice = displaydiscount(item.productId.price, item.productId.discount);
              return (
                <tr key={item._id}>
                  <td className="d-flex align-items-center justify-content-center gap-3">
                    <img
                      src={item.productId.image[0]}
                      alt={item.productId.name}
                      className="rounded border"
                      style={{ height: "60px", width: "60px", objectFit: "contain" }}
                    />
                    <span className="fw-semibold">{item.productId.name}</span>
                  </td>
                  <td className="fw-semibold">${discountedPrice}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          item.quantity > 1 && updateCartQty(item._id, item.quantity - 1)
                        }
                      >
                        <FaArrowDown />
                      </button>
                      <span className="fw-semibold">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateCartQty(item._id, item.quantity + 1)}
                      >
                        <FaArrowUp />
                      </button>
                    </div>
                  </td>
                  <td className="fw-semibold">${Math.floor(discountedPrice * item.quantity)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm d-flex align-items-center gap-1 mx-auto"
                      onClick={() => deleteCartItem(item._id)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="row mt-5 justify-content-end">
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="border rounded-3 p-4 shadow-sm bg-light">
            <h4 className="fw-bold mb-3">Cart Summary</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span className="fw-semibold">${Math.floor(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping:</span>
              <span className="fw-semibold">${shipping}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
              <span>Total:</span>
              <span>${Math.floor(total)}</span>
            </div>
            <Link to="/checkout" className="btn btn-dark w-100 py-2">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/" className="btn btn-outline-dark">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default Cart;
