import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddAddressModal from "./AddAddress";
import EditAddressModal from "./EditAddress";
import { handleAddAddress, setAllAddresses } from "../store/addressSlice";
import { MdEdit, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";

function AddressList({ mode = "manage", onSelect }) {
  const dispatch = useDispatch();
  const addressList = useSelector((state) => state.address.addressList);

  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [editAddressData, setEditAddressData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleEdit = (item) => {
    setEditAddressData(item);
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
    if (onSelect) onSelect(addressList[index]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await axios.delete(`/api/address/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Address deleted successfully");

        const updatedList = addressList.filter((addr) => addr._id !== id);
        dispatch(setAllAddresses(updatedList));
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="container py-3">
      <h5 className="fw-bold mb-3 text-primary">
        {mode === "manage" ? "Manage Addresses" : "Select Address"}
      </h5>

      <div className="d-flex flex-column gap-3">
        {addressList.map((item, index) => (
          <div
            key={item._id || index}
            className={`card shadow-sm border-2 p-3 ${
              selectedIndex === index ? "border-primary bg-light" : ""
            }`}
            onClick={() => mode === "select" && handleSelect(index)}
            style={{
              cursor: mode === "select" ? "pointer" : "default",
              transition: "all 0.2s ease",
            }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold mb-1 text-capitalize">{item.address_line}</h6>
                <p className="mb-0 text-secondary small">
                  {item.city}, {item.state}, {item.country} - {item.pincode}
                </p>
                <p className="mb-0 text-muted small">📞 {item.mobile}</p>
              </div>

              {mode === "manage" && (
                <div className="d-flex gap-3">
                  <MdEdit
                    size={20}
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                  />
                  <MdDelete
                    size={20}
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* زر الإضافة */}
        <div
          className="card border border-primary text-center py-3 shadow-sm"
          style={{ cursor: "pointer", backgroundColor: "#f8f9fa" }}
          onClick={() => setOpenAddAddress(true)}
        >
          <span className="fw-semibold text-primary">
            + Add New Address
          </span>
        </div>
      </div>

      {/* Modals */}
      <AddAddressModal
        show={openAddAddress}
        onClose={() => setOpenAddAddress(false)}
        onAdd={(newAddress) => {
          dispatch(handleAddAddress(newAddress));
          setOpenAddAddress(false);
        }}
      />

      <EditAddressModal
        show={!!editAddressData}
        onClose={() => setEditAddressData(null)}
        addressData={editAddressData}
        onEdit={(updatedAddress) => {
          const updatedList = addressList.map((addr) =>
            addr._id === updatedAddress._id ? updatedAddress : addr
          );
          dispatch(setAllAddresses(updatedList));
          setEditAddressData(null);
        }}
      />
    </div>
  );
}

export default AddressList;
