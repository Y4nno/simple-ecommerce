import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import ProductListing from "./pages/ProductListing";
import Navbar from "./components/Navbar";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminCustomers from "./pages/admin/AdminCustomers";

function App() {
  return (
    <CartProvider>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/cart" element={<><Navbar /><Cart /></>} />
          <Route path="/checkout" element={<><Navbar /><Checkout /></>} />
          <Route path="/products/:id" element={<><Navbar /><ProductDetails /></>} />
          <Route path="/products" element={<><Navbar /><ProductListing /></>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/orders/:id" element={<ProtectedRoute><AdminOrderDetails /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
        </Routes>
      </AdminAuthProvider>
    </CartProvider>
  );
}

export default App;