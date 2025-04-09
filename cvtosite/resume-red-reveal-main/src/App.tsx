
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PreviewPage from "./pages/PreviewPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a new QueryClient instance as a function to ensure it's properly initialized
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Component that handles UUID routing and passes view mode
const UuidRouter = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // Enhanced UUID pattern check - strict UUID v4 pattern validation
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  console.log("UuidRouter: Checking ID pattern for:", id);
  
  if (id && uuidPattern.test(id)) {
    console.log("Detected UUID pattern, rendering PreviewPage directly with ID:", id);
    // We don't pass viewMode directly as prop anymore, use URL params instead
    return <PreviewPage />;
  }
  
  // If not a UUID, it could be a custom slug
  if (id) {
    console.log("Not a UUID pattern, might be a custom slug:", id);
    return <PreviewPage slug={id} />;
  }
  
  console.log("Not a UUID pattern or slug, showing NotFound page for:", id);
  return <NotFound />;
};

const App = () => {
  // Create a new instance of QueryClient inside the component
  const queryClient = createQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              
              {/* Protected routes - require authentication and approval */}
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Dashboard - protected and only for admins */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Preview route pattern - legacy format */}
              <Route path="/preview/:userId" element={<PreviewPage />} />
              
              {/* Direct UUID route - primary format for sharing */}
              <Route path="/:id" element={<UuidRouter />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
