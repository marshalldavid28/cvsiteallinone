
import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title = "Adtechademy - Create Your CV Website",
  description = "Transform your CV into a beautiful personal website in minutes",
  ogImage = "/lovable-uploads/7333d4c8-1b9d-46a0-89f1-d82780348465.png" // Default to our new OG image
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${window.location.origin}${ogImage}`} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${window.location.origin}${ogImage}`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow py-16 px-4">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
        
        <footer className="border-t border-white/10 py-6 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">© 2025 Adtechademy. All rights reserved.</p>
          </div>
        </footer>
        
        {/* This div ensures toasts don't block important content */}
        <div id="toast-region" className="hidden sm:block" aria-hidden="true"></div>
      </div>
    </>
  );
};

export default PageLayout;
