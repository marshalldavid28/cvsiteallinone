
import React from "react";
import Logo from "@/components/Logo";
import AuthForm from "./AuthForm";

interface AuthContainerProps {
  isLogin: boolean;
  toggleAuthMode: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ isLogin, toggleAuthMode }) => {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <Logo className="h-12" />
      </div>
      
      <div className="glass p-8 rounded-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>
        
        <AuthForm isLogin={isLogin} toggleAuthMode={toggleAuthMode} />
      </div>
    </div>
  );
};

export default AuthContainer;
