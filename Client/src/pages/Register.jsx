import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = Object.values(data).every((val) => val);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmpassword) {
      toast.error("Password and confirm password must match");
      return;
    }

    try {
      const response = await Axios({
        url: SummaryApi.Register.url,
        method: SummaryApi.Register.method,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmpassword: "",
        });
        setTimeout(() => navigate("/login"), 800);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
    
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center bg-light p-0">
          <img
            src="/assets/Sign up.svg"
            alt="Register Visual"
            className="img-fluid"
            style={{
              maxWidth: "85%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>

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
              Create an Account
            </h2>

     
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label fw-semibold">
                Name
              </label>
              <input
                name="name"
                type="text"
                className="form-control"
                id="nameInput"
                onChange={handleChange}
                value={data.name}
                required
                placeholder="Enter your name"
              />
            </div>

      
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label fw-semibold">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                id="emailInput"
                onChange={handleChange}
                value={data.email}
                required
                placeholder="Enter your email"
              />
            </div>

       
            <div className="mb-3 position-relative">
              <label htmlFor="passwordInput" className="form-label fw-semibold">
                Password
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                id="passwordInput"
                onChange={handleChange}
                value={data.password}
                required
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  top: "38px",
                  right: "15px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="confirmPasswordInput" className="form-label fw-semibold">
                Confirm Password
              </label>
              <input
                name="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-control pe-5"
                id="confirmPasswordInput"
                onChange={handleChange}
                value={data.confirmpassword}
                required
                placeholder="Confirm your password"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  top: "38px",
                  right: "15px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="btn w-100 text-white fw-semibold py-2"
              style={{
                backgroundColor: "var(--color-primary)",
                border: "none",
                borderRadius: "10px",
                opacity: isFormValid ? 1 : 0.7,
                transition: "0.3s",
              }}
            >
              Register
            </button>

            <div className="text-center mt-3">
              <span>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="fw-semibold text-decoration-none"
                  style={{ color: "var(--color-primary)" }}
                >
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
