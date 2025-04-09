
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { WebsiteData } from "@/types/website";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { downloadCVasJSON } from "@/utils/jsonDownloader";

interface PDFDownloadButtonProps {
  profile: WebsiteData;
  theme: 'dark' | 'light';
  view?: "standard" | "two-column";
}

const LOCAL_STORAGE_KEY = 'json-download-hide-warning';

/**
 * Component that provides JSON download functionality for the CV
 */
const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ 
  profile, 
  theme,
  view = "standard" 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [skipWarning, setSkipWarning] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  
  // Check if user has previously chosen to skip the warning dialog
  useEffect(() => {
    const savedPreference = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPreference === 'true') {
      setSkipWarning(true);
    }
  }, []);

  // Initialize JSON download process
  const initiateDownload = () => {
    if (skipWarning) {
      handleJSONDownload();
    } else {
      setShowConfirmDialog(true);
    }
  };

  // Handle confirmation from warning dialog
  const handleConfirmDownload = () => {
    if (dontShowAgain) {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
      setSkipWarning(true);
    }
    handleJSONDownload();
  };

  // Handle the actual JSON download
  const handleJSONDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Generate a filename with the person's name
      const filename = `${profile.name.replace(/\s+/g, '-')}-cv.json`;
      
      console.log(`Downloading CV as JSON: ${filename}`);
      await downloadCVasJSON(profile, filename);
      
      toast.success("CV data downloaded as JSON successfully!");
    } catch (error) {
      console.error("Failed to download CV data:", error);
      toast.error("Download failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <Button
        onClick={initiateDownload}
        disabled={isGenerating}
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
            <span>Preparing JSON...</span>
          </>
        ) : (
          <>
            <Download size={16} />
            <span>Download JSON</span>
          </>
        )}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className={theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle>Before downloading your CV</AlertDialogTitle>
            <AlertDialogDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
              Your CV data will be downloaded as a JSON file.
              <br /><br />
              <strong>What you can do with this JSON file:</strong>
              <ul className="list-disc pl-5 mt-2">
                <li>Use web-based converters to convert it to PDF</li>
                <li>Import it into other applications</li>
                <li>Save it as a backup of your CV data</li>
              </ul>
              <br />
              <strong>For best results, make sure you've expanded all the sections you want to include.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 my-4">
            <Checkbox 
              id="dont-show-again" 
              checked={dontShowAgain} 
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
              className={theme === 'dark' ? 'border-gray-600 data-[state=checked]:bg-brand-purple' : ''}
            />
            <label 
              htmlFor="dont-show-again" 
              className={`text-sm cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Don't show this warning again
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className={theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-600' : ''}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDownload}
              className={theme === 'dark' ? 'bg-brand-purple hover:bg-brand-purple/90' : 'bg-brand-red hover:bg-brand-red/90'}
            >
              Download JSON
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PDFDownloadButton;
