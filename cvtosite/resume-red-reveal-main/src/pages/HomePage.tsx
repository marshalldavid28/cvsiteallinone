
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        <section className="py-20 px-4 flex-grow flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-white">
                Transform Your <span className="text-gradient-red">CV</span> into a Professional Website
              </h1>
              <div className="absolute inset-0 -z-10 blur-2xl bg-brand-red/10 rounded-full opacity-70"></div>
            </div>
            
            <div className="relative">
              <p className="text-xl md:text-2xl text-gray-300 mb-10">
                Get a personalized website showcasing your professional skills in minutes
              </p>
              <div className="absolute inset-0 -z-10 blur-xl bg-brand-red/5 rounded-full opacity-50"></div>
            </div>
            
            {isAuthenticated ? (
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-brand-red hover:bg-brand-red/90 px-8 py-6 text-lg animate-float">
                  <Link to="/upload">Upload Your CV</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 px-8 py-6 text-lg">
                  <Link to="/dashboard">Manage Your CVs</Link>
                </Button>
              </div>
            ) : (
              <Button asChild size="lg" className="bg-brand-red hover:bg-brand-red/90 px-8 py-6 text-lg animate-float">
                <Link to="/auth">Sign In to Get Started</Link>
              </Button>
            )}
          </div>
        </section>
        
        <section className="py-16 px-4 bg-black/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-6 rounded-xl">
                <div className="w-12 h-12 bg-brand-red/20 text-brand-red rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Upload Your CV</h3>
                <p className="text-gray-300">Simply upload your CV document, and our AI will analyze your professional information.</p>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="w-12 h-12 bg-brand-red/20 text-brand-red rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">AI Generates Your Site</h3>
                <p className="text-gray-300">Our AI technology transforms your CV into a professional website showcasing your skills and experience.</p>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="w-12 h-12 bg-brand-red/20 text-brand-red rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Share Your Website</h3>
                <p className="text-gray-300">Get a unique link to share with potential employers or clients, making your profile stand out.</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild variant="outline" className="border-brand-red/50 text-white hover:bg-brand-red/10">
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© 2025 Adtechademy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
