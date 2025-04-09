
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOutIcon, BarChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Navbar: React.FC = () => {
  const { isAuthenticated, userId, userEmail, signOut } = useAuth();

  // Check if user is an admin
  const { data: isAdmin } = useQuery({
    queryKey: ["isUserAdmin", userId],
    queryFn: async () => {
      if (!userId) return false;
      
      const { data, error } = await supabase.rpc('is_admin', {
        check_user_id: userId
      });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data;
    },
    enabled: isAuthenticated && !!userId,
  });

  return (
    <nav className="w-full py-4 px-4 md:px-8 border-b border-white/5 backdrop-blur-md bg-black/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="group">
          <Logo className="transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <div className="flex gap-4 items-center">
          <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/5">
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/5">
            <Link to="/how-it-works">How It Works</Link>
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/5">
                <Link to="/dashboard">My CVs</Link>
              </Button>
              
              {/* Admin dashboard link - now only shown to users with admin role */}
              {isAdmin && (
                <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/5">
                  <Link to="/admin">
                    <BarChart className="h-4 w-4 mr-2" />
                    Analytics
                  </Link>
                </Button>
              )}
              
              <Button asChild className="relative overflow-hidden group">
                <Link to="/upload" className="bg-gradient-to-r from-brand-red to-[#FF6B81] hover:from-[#FF5A6E] hover:to-[#FF7D90]">
                  <span className="relative z-10">Upload CV</span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF5A6E] to-[#FF7D90] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </Button>
              
              <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
                <div className="hidden md:block text-sm text-white/70">{userEmail}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="text-white/80 hover:text-white hover:bg-white/5"
                  title="Sign Out"
                >
                  <LogOutIcon className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <Button asChild className="relative overflow-hidden group">
              <Link to="/auth" className="bg-gradient-to-r from-brand-red to-[#FF6B81] hover:from-[#FF5A6E] hover:to-[#FF7D90]">
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF5A6E] to-[#FF7D90] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
