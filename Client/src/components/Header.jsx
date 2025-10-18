import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Search from './Search'
import { useSelector, useDispatch } from 'react-redux';
import { IoPersonCircleSharp } from "react-icons/io5";
import { SummaryApi } from '../common/SummaryApi';
import { Axios } from '../Utils/Axios';
import toast from 'react-hot-toast';
import { deluserinfo } from '../store/userdetailsSlice';

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state?.user?.userinfo);

    const handlelogout = async (e) => {
        try {
            e.preventDefault();
            const response = await Axios({
                url: SummaryApi.logout.url,
                method: SummaryApi.logout.method
            });
            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                dispatch(deluserinfo());
                toast.success(response.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
            <div className="container">
            
                <Link className="navbar-brand fw-bold text-success" to="/">MyShop</Link>

           
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

              
                <div className="collapse navbar-collapse" id="navbarContent">
                
                    <div className="mx-auto my-3 my-lg-0" style={{ width: '100%', maxWidth: '400px' }}>
                        <Search />
                    </div>

                  
                    <div className="d-flex align-items-center gap-2 ms-auto">
                        {!user && (
                            <>
                                <Link to={"/register"} className="btn btn-outline-success btn-sm">Register</Link>
                                <Link to={"/login"} className="btn btn-outline-success btn-sm">Login</Link>
                            </>
                        )}

                        {user && (
                            <>
                       
                                <div className="dropdown ms-auto">
                                    <button
                                        className="btn border-0 d-flex align-items-center dropdown-toggle"
                                        type="button"
                                        id="dropdownMenu2"
                                        data-bs-toggle="dropdown"
                                        data-bs-display="static"
                                        aria-expanded="false"
                                    >
                                        <IoPersonCircleSharp size={35} className="me-1 text-success" />
                                        <span className="d-none d-lg-inline fw-semibold text-dark">
                                            {user.name}
                                        </span>
                                    </button>

                                    <ul
                                        className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2"
                                        aria-labelledby="dropdownMenu2"
                                    >
                                        <li>
                                            <button className="dropdown-item py-2" onClick={() => navigate("/profile")}>
                                                My Profile
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item py-2" onClick={() => navigate("/profile/my-orders")}>
                                                My Orders
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item py-2" onClick={() => navigate("/profile/my-address")}>
                                                Address
                                            </button>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button
                                                className="dropdown-item text-danger fw-semibold py-2"
                                                onClick={handlelogout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                               
                                <Link to="/cart" className="btn btn-outline-success btn-sm">
                                    My Cart
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
