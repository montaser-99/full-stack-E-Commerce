import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  
    const storedUser = localStorage.getItem("userInfo");


  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }


  return children;
};

export default ProtectedRoute;
