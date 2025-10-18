import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';

import toast from "react-hot-toast";
import { Axios } from "../Utils/Axios";
import { SummaryApi } from "../common/SummaryApi";
import { fetchCartItem } from "../store/cartSlice";

const AddToCartButton = ({ product }) => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const itemInCart = cart.find((item) => item.productId._id === product._id);
  const qty = itemInCart?.quantity || 0;

  const handleAdd = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await Axios({
        ...SummaryApi.AddToCart,
        data: { productId: product._id },
      });
      if (res.data.success) {
        toast.success(res.data.message || "Added to cart");
        dispatch(fetchCartItem());
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (newQty) => {
    if (!itemInCart) return;
    try {
      const res = await Axios({
        ...SummaryApi.UpdateCart,
        data: { _id: itemInCart._id, qty: newQty },
      });
      if (res.data.success) {
        toast.success("Quantity updated");
        dispatch(fetchCartItem());
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update quantity");
    }
  };

  const deleteItem = async () => {
    if (!itemInCart) return;
    try {
      const res = await Axios({
        ...SummaryApi.DeleteCart,
        data: { _id: itemInCart._id },
      });
      if (res.data.success) {
        toast.success("Item removed from cart");
        dispatch(fetchCartItem());
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="d-flex align-items-center" style={{ width: "fit-content" }}>
      {itemInCart ? (
        <div className="d-flex align-items-center border rounded-pill shadow-sm overflow-hidden">
          <button
            className="btn btn-light py-1 px-2 border-0"
            onClick={() => (qty === 1 ? deleteItem() : updateQty(qty - 1))}
            title="Decrease quantity"
          >
            <FaMinus className="text-success" />
          </button>

          <span
            className="px-3 fw-semibold"
            style={{ minWidth: 40, textAlign: "center" }}
          >
            {qty}
          </span>

          <button
            className="btn btn-light py-1 px-2 border-0"
            onClick={() => updateQty(qty + 1)}
            title="Increase quantity"
          >
            <FaPlus className="text-success" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          disabled={loading}
          className="btn btn-success d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
        >
          <FaShoppingCart />
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
