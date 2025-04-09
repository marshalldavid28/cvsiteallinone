
import React, { useState, useEffect } from "react";
import AuthContainer from "@/components/auth/AuthContainer";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { supabase } from "@/integrations/supabase/client";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { session } = useAuthRedirect();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  // Log auth status on page mount
  useEffect(() => {
    console.log("AuthPage mounted, checking for existing session");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthPage session check:", !!session);
    });

    // Also add listener for auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event in AuthPage:", event, session?.user?.id);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-darker">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <AuthContainer isLogin={isLogin} toggleAuthMode={toggleAuthMode} />
      </div>
    </div>
  );
};

export default AuthPage;
