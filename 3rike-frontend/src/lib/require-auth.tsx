// Route guard. Wrap a <Route element={...}> with this to require an
// authenticated user. While the initial /auth/me check is in flight, shows a
// minimal loading state to avoid a login-page flash for already-logged-in
// users.

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-3 border-[#01C259] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
