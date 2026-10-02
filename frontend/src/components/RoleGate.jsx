import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMyProfile } from "../services/authService";
import { disconnectSocket } from "../socket";
import LoadingState from "./ui/LoadingState";

function readToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return { status: "missing" };

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return { status: "expired" };
    return { status: "present" };
  } catch {
    return { status: "invalid" };
  }
}

function clearSession() {
  disconnectSocket();
  localStorage.removeItem("authToken");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userRole");
}

// Loads the role from the database via GET /auth/users/me. Route panels follow
// that role, not the role copied into the JWT at login.
function useDatabaseRole() {
  const [state, setState] = useState({ status: "loading", role: null });

  useEffect(() => {
    let cancelled = false;
    const token = readToken();

    if (token.status !== "present") {
      if (token.status !== "missing") clearSession();
      setState({ status: "anonymous", role: null });
      return undefined;
    }

    getMyProfile()
      .then((data) => {
        if (cancelled) return;
        const role = data?.user?.role;
        if (role === "admin" || role === "user") {
          localStorage.setItem("userRole", role);
          setState({ status: "ready", role });
          return;
        }
        setState({ status: "anonymous", role: null });
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 401) {
          setState({ status: "anonymous", role: null });
          return;
        }
        setState({ status: "error", role: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function homeFor(role) {
  if (role === "admin") return "/admin";
  if (role === "user") return "/home";
  return "/login";
}

export function RequireRole({ role, children }) {
  const state = useDatabaseRole();

  if (state.status === "loading") {
    return <LoadingState label="Checking access" minHeight="100vh" />;
  }
  if (state.status === "error") {
    return <LoadingState label="Unable to confirm access. Refresh to try again." minHeight="100vh" />;
  }
  if (state.status !== "ready") return <Navigate to="/login" replace />;
  if (state.role !== role) return <Navigate to={homeFor(state.role)} replace />;
  return children;
}

export function RedirectIfAuthenticated({ children }) {
  const state = useDatabaseRole();
  const token = readToken();

  if (token.status === "missing") return children;
  if (state.status === "loading") {
    return <LoadingState label="Checking access" minHeight="100vh" />;
  }
  if (state.status === "error") {
    return <LoadingState label="Unable to confirm access. Refresh to try again." minHeight="100vh" />;
  }
  if (state.status === "ready") return <Navigate to={homeFor(state.role)} replace />;
  return children;
}
