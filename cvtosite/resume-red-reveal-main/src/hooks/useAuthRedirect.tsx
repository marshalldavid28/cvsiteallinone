
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthRedirect = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth redirect hook initializing");
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth redirect - state changed:", event);
        setSession(currentSession);
        
        if (currentSession) {
          console.log("User is logged in, redirecting to home");
          navigate('/');
        }
      }
    );

    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Auth redirect - initial session check:", !!currentSession);
      setSession(currentSession);
      
      if (currentSession) {
        console.log("User is already logged in, redirecting to home");
        navigate('/');
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return { session, isLoading };
};
