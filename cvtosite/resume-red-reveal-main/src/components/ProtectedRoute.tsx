
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-darker">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-brand-red animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Checking authentication...</h2>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!isAuthenticated) {
    toast.info("Please sign in to continue", { id: "auth-required" });
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
