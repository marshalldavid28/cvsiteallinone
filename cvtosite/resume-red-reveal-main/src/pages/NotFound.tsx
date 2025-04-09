
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Check if it might be a CV preview URL - enhanced pattern detection
  const uuidPattern = /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
  const mightBeCvPreview = path.includes('preview') || uuidPattern.test(path);
  
  // Check if it might be a custom slug - simpler pattern
  const slugPattern = /^\/([a-z0-9-]+)$/;
  const mightBeCustomSlug = slugPattern.test(path);
  
  useEffect(() => {
    console.error(
      "404 Error: Path not found:",
      path,
      "with search params:",
      location.search,
      "on domain:",
      window.location.origin,
      "fullURL:",
      window.location.href
    );
  }, [path, location.search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-darker text-white">
      <div className="text-center max-w-md px-4">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h1 className="text-6xl font-bold mb-4 text-brand-red">404</h1>
        <p className="text-xl text-gray-300 mb-6">We couldn't find the page you're looking for</p>
        
        <div className="p-4 bg-black/30 rounded-lg border border-white/10 mb-6 text-left">
          {mightBeCvPreview ? (
            <>
              <p className="text-sm text-brand-red mb-2 font-semibold">CV Website Access Error:</p>
              <p className="text-sm text-gray-400 mb-2">Current URL: {window.location.href}</p>
              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
                <li>The UUID format seems correct, but the CV data might not exist</li>
                <li>Try using one of these URL formats:</li>
                <li><code className="bg-black/40 px-1 rounded">{window.location.origin}/[UUID]?view=public</code></li>
                <li>Or: <code className="bg-black/40 px-1 rounded">{window.location.origin}/preview/[UUID]?view=public</code></li>
                <li>Make sure the UUID exists in the database</li>
                <li>If you just created this CV, try generating the URL again</li>
              </ul>
            </>
          ) : mightBeCustomSlug ? (
            <>
              <p className="text-sm text-brand-red mb-2 font-semibold">Custom URL Error:</p>
              <p className="text-sm text-gray-400 mb-2">Current URL: {window.location.href}</p>
              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
                <li>This looks like a custom URL, but no CV website was found with this name</li>
                <li>Check that you've spelled the URL correctly</li>
                <li>This URL might have been removed or changed by its owner</li>
                <li>If you're the owner, try accessing your CV through the admin panel</li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-2">If you're trying to access a CV website:</p>
              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
                <li>Make sure the URL is correct and complete</li>
                <li>Check that the URL format is either a custom name or a valid UUID</li>
                <li>Try generating a new shareable URL from the CV editor</li>
              </ul>
            </>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-brand-red hover:bg-brand-red/90">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20">
            <Link to="/upload">Create New CV Site</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
