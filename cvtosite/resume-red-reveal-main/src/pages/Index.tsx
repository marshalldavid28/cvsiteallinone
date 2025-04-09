
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setCheckedAuth(true);
      
      // Only redirect to dashboard if authenticated
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        // If not authenticated, go to home page
        navigate("/");
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (isLoading || !checkedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-darker">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-brand-red animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Loading...</h2>
        </div>
      </div>
    );
  }

  // This return will rarely be used since we navigate away in the useEffect
  return null;
};

export default Index;
