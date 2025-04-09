
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import ProcessingView from "@/components/upload/ProcessingView";
import UploadFormContent from "@/components/upload/UploadFormContent";
import NextStepsGuide from "@/components/upload/NextStepsGuide";
import { useProcessCV } from "@/hooks/useProcessCV";
import { Helmet } from "react-helmet-async";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string>("");
  const [designStyle, setDesignStyle] = useState<string>("tech");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  const { 
    processCV, 
    handleReset, 
    processingState, 
    totalSteps 
  } = useProcessCV({
    file,
    cvText,
    designStyle,
    linkedInUrl,
    profileImage
  });
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };
  
  const handleTextExtracted = (text: string) => {
    console.log("Text extracted from CV:", text.substring(0, 300) + "...");
    setCvText(text);
  };
  
  return (
    <>
      <Helmet>
        <title>Upload Your CV - Adtechademy</title>
        <meta name="description" content="Upload your CV and transform it into a beautiful personal website in minutes." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Upload Your CV - Adtechademy" />
        <meta property="og:description" content="Upload your CV and transform it into a beautiful personal website in minutes." />
        <meta property="og:image" content={`${window.location.origin}/lovable-uploads/7333d4c8-1b9d-46a0-89f1-d82780348465.png`} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upload Your CV - Adtechademy" />
        <meta name="twitter:description" content="Upload your CV and transform it into a beautiful personal website in minutes." />
        <meta name="twitter:image" content={`${window.location.origin}/lovable-uploads/7333d4c8-1b9d-46a0-89f1-d82780348465.png`} />
      </Helmet>
      
      <PageLayout>
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Upload Your CV</h1>
          <p className="text-gray-300">
            We'll transform your CV into a beautiful personal website in minutes.
          </p>
        </div>
        
        {processingState.isProcessing ? (
          <ProcessingView
            step={processingState.processingStep}
            totalSteps={totalSteps}
            currentStep={processingState.currentStepText}
            error={processingState.processingError}
            onReset={handleReset}
          />
        ) : (
          <UploadFormContent
            file={file}
            cvText={cvText}
            linkedInUrl={linkedInUrl}
            designStyle={designStyle}
            profileImage={profileImage}
            onFileSelect={handleFileSelect}
            onTextExtracted={handleTextExtracted}
            onLinkedInChange={setLinkedInUrl}
            onStyleSelect={setDesignStyle}
            onProfileImageSelect={setProfileImage}
            onProcess={processCV}
          />
        )}
        
        <NextStepsGuide />
      </PageLayout>
    </>
  );
};

export default UploadPage;
