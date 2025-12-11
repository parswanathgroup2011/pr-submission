import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Home from "./pages/client/Home";
import Plans from "./pages/client/Plans";
import PostPressRelease from "./pages/client/PostPressRelease";
import Transactions from "./pages/client/Transactions";
import Profile from "./pages/client/Profile";

import { useState } from "react";
import RefreshHandler from "./RefreshHandler";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminPressReleaseTable from "./pages/admin/AdminPressRelease";
import UserWallet from "./pages/admin/UserWallet";
import AdminManualTopups from "./pages/admin/AdminManualTopups";
import UserNotifications from "./pages/client/UserNotifications";
import AdminNotifications from "./pages/admin/AdminNotifications";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set true for testing

  // 🔒 Client Protected Route
  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem("authToken");
    if (!token) return <Navigate to="/login" />;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "user" ? element : <Navigate to="/admin" />;
  };

  // 🔒 Admin Protected Route
  const AdminRoute = ({ element }) => {
    const token = localStorage.getItem("authToken");
    if (!token) return <Navigate to="/login" />;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "admin" ? element : <Navigate to="/home" />;
  };

  // 🚫 Public Route (block logged-in users)
  const PublicRoute = ({ element }) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role === "admin" ? (
        <Navigate to="/admin" />
      ) : (
        <Navigate to="/home" />
      );
    }
    return element;
  };

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        {/* Public Routes (only accessible if not logged in) */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
        <Route
          path="/forgot-password"
          element={<PublicRoute element={<ForgotPassword />} />}
        />
        <Route
          path="/reset-password"
          element={<PublicRoute element={<ResetPassword />} />}
        />

        {/* Client Protected Routes inside Layout */}
        <Route path="/" element={<PrivateRoute element={<Layout />} />}>
          <Route path="home" element={<Home />} />
          <Route path="plans" element={<Plans />} />
          <Route path="press-release" element={<PostPressRelease />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<UserNotifications />} />

        </Route>

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="press-releases" element={<AdminPressReleaseTable />} />
          <Route path="manual-topups" element={<AdminManualTopups />} />
          <Route path="wallets" element={<UserWallet />} />
          <Route path="notifications" element={<AdminNotifications />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;
