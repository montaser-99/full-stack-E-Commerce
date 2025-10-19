import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state?.user?.userinfo);
    const storedUser = localStorage.getItem("userInfo");


  if (!user||!storedUser) {
    return <Navigate to="/login" replace />;
  }


  return children;
};

export default ProtectedRoute;
