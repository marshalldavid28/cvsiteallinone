
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteData } from "@/types/website";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CVWebsite {
  id: string;
  custom_slug: string | null;
  website_data: WebsiteData;
  created_at: string;
  updated_at: string;
}

const DashboardPage: React.FC = () => {
  const { isAuthenticated, isApproved, userId } = useAuth();
  const [websites, setWebsites] = useState<CVWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [websiteToDelete, setWebsiteToDelete] = useState<CVWebsite | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    // Fetch user's CV websites
    const fetchUserWebsites = async () => {
      if (!userId) return;
      
      console.log("Fetching websites for user ID:", userId);
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('cv_websites')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        console.log("Retrieved websites data:", data);
        
        // Convert the raw data to properly typed CVWebsite objects with safe type assertion
        const typedWebsites: CVWebsite[] = data?.map(item => ({
          id: item.id,
          custom_slug: item.custom_slug,
          // First cast to unknown, then to WebsiteData to satisfy TypeScript
          website_data: (typeof item.website_data === 'object' ? item.website_data : {}) as unknown as WebsiteData,
          created_at: item.created_at || '',
          updated_at: item.updated_at || ''
        })) || [];
        
        console.log("Processed websites:", typedWebsites);
        setWebsites(typedWebsites);
      } catch (error) {
        console.error("Error fetching CV websites:", error);
        toast.error("Failed to load your CV websites");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserWebsites();
  }, [isAuthenticated, userId, navigate]);

  const getShareableUrl = (website: CVWebsite) => {
    const baseUrl = window.location.origin;
    return website.custom_slug 
      ? `${baseUrl}/${website.custom_slug}`
      : `${baseUrl}/${website.id}`;
  };
  
  const getEditUrl = (website: CVWebsite) => {
    return `/preview/${website.id}`;
  };
  
  const handleEditCV = (website: CVWebsite) => {
    navigate(getEditUrl(website));
  };
  
  const handleViewCV = (website: CVWebsite) => {
    const publicUrl = getShareableUrl(website);
    window.open(publicUrl, '_blank');
  };

  const handleDeleteClick = (website: CVWebsite) => {
    setWebsiteToDelete(website);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!websiteToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('cv_websites')
        .delete()
        .eq('id', websiteToDelete.id);

      if (error) {
        throw error;
      }

      // Remove the deleted website from the state
      setWebsites(websites.filter(site => site.id !== websiteToDelete.id));
      toast.success("CV website deleted successfully");
    } catch (error) {
      console.error("Error deleting CV website:", error);
      toast.error("Failed to delete CV website");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setWebsiteToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My CV Websites</h1>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-brand-red animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your CV websites...</p>
            </div>
          ) : websites.length === 0 ? (
            <div className="glass p-8 text-center rounded-xl">
              <h2 className="text-2xl font-bold mb-4">No CV Websites Yet</h2>
              <p className="text-gray-300 mb-6">You haven't created any CV websites yet. Get started by uploading your CV.</p>
              <Button 
                className="bg-brand-red hover:bg-brand-red/90"
                onClick={() => navigate("/upload")}
              >
                Upload CV
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map((website) => (
                <div key={website.id} className="glass p-6 rounded-xl flex flex-col">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold mb-2 truncate">
                      {website.website_data.name || "Untitled CV"}
                    </h2>
                    <p className="text-gray-400 text-sm mb-2">
                      {website.website_data.title || "No title"}
                    </p>
                    <p className="text-gray-500 text-xs mb-4">
                      Last updated: {new Date(website.updated_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm mb-4 truncate">
                      URL: {website.custom_slug ? `/${website.custom_slug}` : `/${website.id}`}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 text-white/90 border-white/20"
                        onClick={() => handleViewCV(website)}
                      >
                        View
                      </Button>
                      <Button 
                        className="flex-1 bg-brand-red hover:bg-brand-red/90"
                        onClick={() => handleEditCV(website)}
                      >
                        Edit
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="text-white/90 border-white/20 hover:bg-red-800/20 hover:text-red-400 hover:border-red-800/40 transition-colors"
                      onClick={() => handleDeleteClick(website)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this CV website?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the CV website 
              {websiteToDelete && (
                <span className="font-semibold">
                  {" "}"{websiteToDelete.website_data.name || "Untitled CV"}"
                </span>
              )}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
              className="bg-transparent border-white/20 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPage;
