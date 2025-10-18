import { Outlet, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import isAdmin from "../Utils/isAdmin";
import { Axios } from "../Utils/Axios";
import { SummaryApi } from "../common/SummaryApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deluserinfo } from "../store/userdetailsSlice";
import { useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

function Profile() {
  const user = useSelector((state) => state?.user?.userinfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true); // السايد بار مفتوحة افتراضياً

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.success) {
        dispatch(deluserinfo());
        toast.success("Logout Successfully");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profile-layout">
   
      <div
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaChevronLeft /> : <FaChevronRight />}
      </div>

      {/* ✅ السايد بار */}
      <div className={`sidebar-wrapper ${open ? "open" : ""}`}>
        <aside className="sidebar mt-4">
          {user && isAdmin(user.role) && (
            <>
              <NavLink to="product" className="sidebar-item mt-5">
                Products
              </NavLink>
              <NavLink to="upload-product" className="sidebar-item mt-2">
                Upload Product
              </NavLink>
              <NavLink to="category" className="sidebar-item mt-2">
                Categories
              </NavLink>
              <NavLink to="sub-category" className="sidebar-item mt-2">
                Sub Categories
              </NavLink>
            </>
          )}

          <NavLink to="my-profile" className="sidebar-item mt-2">
            My Profile
          </NavLink>
          <NavLink to="my-orders" className="sidebar-item mt-2">
            My Orders
          </NavLink>
          <NavLink to="my-address" className="sidebar-item mt-2">
            My Address
          </NavLink>

          <button
            onClick={handleLogout}
            className="sidebar-item btn btn-danger w-100 mt-3"
          >
            Logout
          </button>
        </aside>
      </div>

      <main className={`main-content ${open ? "shifted" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Profile;
