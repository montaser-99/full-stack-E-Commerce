import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Searchpage from "../pages/Searchpage.jsx";
import VerifyEmail from "../pages/Verifyemail.jsx";
import Forgotpassword from "../pages/Forgotpassword.jsx";
import Verifyotp from "../pages/verifyotp.jsx";
import Setpassword from "../pages/Setpassword.jsx";
import App from "../App.jsx";
import Profile from "../pages/profile.jsx";
import Myprofile from "../pages/myprofile.jsx";
import Myadddress from "../pages/myadddress.jsx";
import Myorders from "../pages/myorders.jsx";
import ProductAdmin from "../pages/ProductAdmin.jsx";
import Category from "../pages/Category.jsx";
import UploadProduct from "../pages/uploadProduct.jsx";
import SubCategory from "../pages/subCategory.jsx";
import ProductListPage from "../pages/ProductListPage.jsx";
import ProductDisplayPage from "../pages/ProductDisplayPage.jsx";
import Cart from "../pages/Cart.jsx";
import Checkout from "../pages/Checkout.jsx";
import AdminPermission from "../components/Adminpermission.jsx";
import ProtectedRoute from "../components/Protectroute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // ✅ لو المستخدم مش داخل -> يروح Login
      { path: "", element: <Navigate to="/login" replace /> },

      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "search", element: <Searchpage /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "forgot-password", element: <Forgotpassword /> },
      { path: "verify-otp", element: <Verifyotp /> },
      { path: "set-password", element: <Setpassword /> },

      // 🧩 الصفحات المحمية (لازم المستخدم يكون داخل)
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="my-profile" replace /> },
          { path: "my-profile", element: <Myprofile /> },
          { path: "my-address", element: <Myadddress /> },
          { path: "my-orders", element: <Myorders /> },

          // 🧠 الصفحات الخاصة بالأدمن فقط
          {
            path: "category",
            element: (
              <AdminPermission>
                <Category />
              </AdminPermission>
            ),
          },
          {
            path: "sub-category",
            element: (
              <AdminPermission>
                <SubCategory />
              </AdminPermission>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermission>
                <ProductAdmin />
              </AdminPermission>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminPermission>
                <UploadProduct />
              </AdminPermission>
            ),
          },
        ],
      },

      // 🛍 صفحات المنتجات
      {
        path: "product/:category/:subCategory",
        element: <ProductListPage />,
      },
      {
        path: "product-details/:productId",
        element: <ProductDisplayPage />,
      },
      {
        path: "cart",
        element: <ProtectedRoute><Cart /></ProtectedRoute>,
      },
      {
        path: "checkout",
        element: <ProtectedRoute><Checkout /></ProtectedRoute>,
      },
    ],
  },
]);

export default router;
