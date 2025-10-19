import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { useDispatch } from 'react-redux';
import { getuserinfo } from '../store/userdetailsSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    email: "admin@gmail.com",
    password: "Admin987*",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = Object.values(data).every(val => val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        url: SummaryApi.login.url,
        method: SummaryApi.login.method,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(getuserinfo(response.data.user));
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));

        setData({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side image */}
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center bg-light p-0">
          <img
            src="/assets/login.svg"
            alt="Login Visual"
            className="img-fluid"
            style={{
              maxWidth: "85%",
              height: "auto",
              objectFit: "contain"
            }}
          />
        </div>

        {/* Right side form */}
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-3">
          <form
            className="w-100"
            style={{
              maxWidth: "400px",
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              padding: "30px",
            }}
            onSubmit={handleSubmit}
          >
            <h2
              className="text-center mb-4 fw-bold"
              style={{ color: "var(--color-primary)" }}
            >
              Login
            </h2>

            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label fw-semibold">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="Enter your email"
                onChange={handleChange}
                value={data.email}
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="passwordInput" className="form-label fw-semibold">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                id="passwordInput"
                placeholder="Enter your password"
                onChange={handleChange}
                value={data.password}
              />
              <span
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  top: '38px',
                  right: '15px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showPassword ? <FaEye /> : <IoMdEyeOff />}
              </span>
            </div>

            <button
              type="submit"
              className="btn w-100 my-3 text-white fw-semibold"
              disabled={!isFormValid}
              style={{
                backgroundColor: "var(--color-primary)",
                borderColor: "var(--color-border)",
                transition: "0.3s",
              }}
            >
              Sign in
            </button>

            <div className="text-center">
              <Link to="/forgot-password" className="d-block mb-2 text-decoration-none">
                Forgot your password?
              </Link>
              <span>
                Don’t have an account?{" "}
                <Link to="/register" className="fw-semibold text-decoration-none">
                  Register
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
