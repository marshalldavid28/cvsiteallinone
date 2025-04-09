
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  isLogin: boolean;
  toggleAuthMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, toggleAuthMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(`Attempting to ${isLogin ? 'sign in' : 'sign up'} user:`, email);
      
      if (isLogin) {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data?.user) {
          console.log("Login successful, user:", data.user.id);
          toast.success("Login successful! Redirecting...");
        }
      } else {
        // Validate form for signup
        if (!fullName.trim()) {
          toast.error("Please enter your full name");
          setIsLoading(false);
          return;
        }
        
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }

        // Handle signup with better error handling
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) throw error;
        
        if (data?.user) {
          console.log("Signup successful, user:", data.user.id);
          toast.success("Signup successful! You can now use the app.");
        } else {
          toast.info("Signup initiated. Please check your email for confirmation if required.");
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Provide more user-friendly error messages
      if (error.message.includes("Email already registered")) {
        toast.error("This email is already registered. Try signing in instead.");
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.message.includes("rate limit")) {
        toast.error("Too many attempts. Please try again later.");
      } else {
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required={!isLogin}
            placeholder="Your full name"
            className="bg-white/5 border-white/10"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="bg-white/5 border-white/10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="bg-white/5 border-white/10"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-brand-red hover:bg-brand-red/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Processing...
          </span>
        ) : (
          isLogin ? "Sign In" : "Create Account"
        )}
      </Button>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-sm text-gray-400 hover:text-white underline"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
