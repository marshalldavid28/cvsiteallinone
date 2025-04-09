import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PreviewLayout from "@/components/preview/PreviewLayout";
import PreviewContent from "@/components/preview/PreviewContent";
import { usePreviewData } from "@/hooks/use-preview-data";
import { getDesignStyles } from "@/components/preview/StyleUtils";
import { WebsiteData } from "@/types/website";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

interface PreviewPageProps {
  slug?: string;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ slug: propSlug }) => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const paramViewMode = searchParams.get("view");
  
  const [viewMode, setViewMode] = useState<string | null>(propSlug ? "public" : paramViewMode);
  
  const [resolvedUserId, setResolvedUserId] = useState<string | undefined>(userId);
  const [isResolving, setIsResolving] = useState(!!propSlug);
  const [resolveError, setResolveError] = useState<string | null>(null);
  
  useEffect(() => {
    const resolveSlug = async () => {
      if (!propSlug) return;
      
      setIsResolving(true);
      setResolveError(null);
      
      try {
        console.log("Resolving custom slug:", propSlug);
        
        const { data, error } = await supabase
          .from('cv_websites')
          .select('user_id, id')
          .eq('custom_slug', propSlug)
          .maybeSingle();
        
        if (error) {
          console.error("Error resolving slug:", error);
          setResolveError("Could not find a CV with this URL");
        } else if (!data) {
          console.error("No CV found with slug:", propSlug);
          setResolveError("No CV found with this URL");
        } else {
          console.log("Resolved slug to user ID:", data.user_id);
          console.log("Database record ID:", data.id);
          
          setResolvedUserId(data.id);
          setViewMode("public");
        }
      } catch (err) {
        console.error("Error in slug resolution:", err);
        setResolveError("Error loading CV data");
      } finally {
        setIsResolving(false);
      }
    };
    
    if (propSlug) {
      resolveSlug();
    }
  }, [propSlug]);
  
  const { 
    profile, 
    isAdmin, 
    isEditMode, 
    isLoading: isProfileLoading, 
    loadError, 
    toggleEditMode, 
    handleProfileUpdate, 
    theme, 
    toggleTheme
  } = usePreviewData(resolvedUserId, viewMode, isResolving);

  const isLoading = isProfileLoading || isResolving;
  
  const combinedError = !isLoading ? (resolveError || loadError) : null;

  const styles = getDesignStyles(profile, theme);
  
  const getMetaContent = () => {
    if (!profile) return null;
    
    const title = profile.name 
      ? `${profile.name} - Professional Portfolio` 
      : "Professional Portfolio";
    
    const description = profile.bio 
      ? profile.bio.substring(0, 160) + (profile.bio.length > 160 ? '...' : '')
      : "View my professional experience, skills, and projects";
    
    const imageUrl = "/lovable-uploads/7333d4c8-1b9d-46a0-89f1-d82780348465.png";
    
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${window.location.origin}${imageUrl}`} />
        <meta property="og:url" content={window.location.href} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${window.location.origin}${imageUrl}`} />
      </Helmet>
    );
  };

  if (combinedError) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Error</h2>
          <p className="text-gray-500">{combinedError}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-red"></div>
          <h2 className="text-2xl font-medium mt-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      {getMetaContent()}
      <PreviewLayout
        userId={resolvedUserId || ''}
        isAdmin={isAdmin && !propSlug}
        isEditMode={isEditMode && !propSlug}
        toggleEditMode={toggleEditMode}
        profile={profile as WebsiteData}
        theme={theme}
        toggleTheme={toggleTheme}
        onProfileUpdate={handleProfileUpdate}
      >
        <PreviewContent
          profile={profile as WebsiteData}
          styles={styles}
          isAdmin={isAdmin && !propSlug}
          isEditMode={isEditMode && !propSlug}
          isLoading={isLoading}
          onProfileUpdate={handleProfileUpdate}
          toggleEditMode={toggleEditMode}
          theme={theme}
        />
      </PreviewLayout>
    </>
  );
};

export default PreviewPage;
