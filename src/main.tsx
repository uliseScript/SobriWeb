import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import App from "./App";

import Login from "./pages/auth/Login.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import HomePage from "./pages/HomePage.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import Dashboard from "./pages/users/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeFamily from "./pages/Family/HomeFamily.tsx";
import HomePartner from "./pages/Partners/HomePartner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
        />
        <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeFamily"
          element={
            <ProtectedRoute>
              <HomeFamily />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homePartner"
          element={
            <ProtectedRoute>
              <HomePartner />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </StrictMode>
);
