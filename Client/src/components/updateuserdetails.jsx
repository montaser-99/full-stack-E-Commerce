import React, { useState } from "react";
import { SummaryApi } from "../common/SummaryApi";
import { useSelector, useDispatch } from "react-redux";
import { Axios } from "../Utils/Axios";
import toast from "react-hot-toast";
import { getuserinfo } from "../store/userdetailsSlice";
import { Link } from "react-router-dom";

function Updateuserdetails() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userinfo);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      if (file) {
        const imageData = new FormData();
        imageData.append("avatar", file);

        await Axios({
          ...SummaryApi.uploadAvatar,
          data: imageData,
          withCredentials: true,
     
        });
      }

      
      await Axios({
        ...SummaryApi.updateUser,
        data: formData,
        withCredentials: true,
      });

     
      const profileRes = await Axios({
        ...SummaryApi.userdetails,
        withCredentials: true,
      });

      const updatedUser = profileRes.data.data.user;
      dispatch(getuserinfo(updatedUser));
      toast.success("Profile updated successfully ✨");
    } catch (err) {
      toast.error("Failed to update profile");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-5">
      {/* Profile Header */}
      <div className="text-center mb-4">
        <div
          className="mx-auto rounded-circle overflow-hidden border shadow-sm d-flex align-items-center justify-content-center bg-light"
          style={{ width: 120, height: 120 }}
        >
          {preview ? (
            <img
              src={preview}
              alt="avatar"
              className="w-100 h-100 object-fit-cover"
            />
          ) : (
            <span className="text-secondary fw-semibold">No Image</span>
          )}
        </div>

        <button
          className="btn btn-outline-primary mt-3"
          data-bs-toggle="modal"
          data-bs-target="#editAvatarModal"
        >
          Change Profile Photo
        </button>
      </div>

      {/* Modal for image upload */}
      <div
        className="modal fade"
        id="editAvatarModal"
        aria-hidden="true"
        aria-labelledby="editAvatarModalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-sm">
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-semibold" id="editAvatarModalLabel">
                Upload New Avatar
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <input
                type="file"
                className="form-control mb-3"
                accept="image/*"
                onChange={handleFileChange}
              />
              {file && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="rounded-circle border"
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        className="bg-white p-4 shadow-sm rounded mx-auto"
        style={{ maxWidth: 500 }}
        onSubmit={handleSubmit}
      >
        <h4 className="mb-4 text-center text-primary fw-bold">
          Update Profile Information
        </h4>

        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            onChange={handlechange}
            value={formData.name}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            onChange={handlechange}
            value={formData.email}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Mobile</label>
          <input
            type="text"
            className="form-control"
            name="mobile"
            onChange={handlechange}
            value={formData.mobile}
          />
        </div>

        <Link
          to="/forgot-password"
          className="btn btn-outline-secondary w-100 mb-3"
        >
          Change Password
        </Link>

        <button
          type="submit"
          className="btn btn-primary w-100 fw-semibold"
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default Updateuserdetails;
