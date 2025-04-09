
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  isApproved: boolean;
  isLoading: boolean;
  userId: string | null;
  userEmail: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isApproved: false,
  isLoading: true,
  userId: null,
  userEmail: null,
  signOut: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isApproved, setIsApproved] = useState(true); // Always set to true
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    console.log("AuthProvider initializing");
    
    // Set up auth state change listener first to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setIsAuthenticated(!!session);
        setUserId(session?.user?.id || null);
        setUserEmail(session?.user?.email || null);
        setIsLoading(false);
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
      setUserEmail(session?.user?.email || null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error("Failed to sign out");
        return;
      }
      
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isApproved: true, // Always return true for isApproved
      isLoading, 
      userId, 
      userEmail,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
