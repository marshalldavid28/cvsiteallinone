
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">How Adtechademy Works</h1>
            <p className="text-xl text-gray-300">
              From CV to personal website in minutes - no coding required.
            </p>
          </div>
          
          <div className="space-y-20">
            <Step 
              number={1}
              title="Upload Your CV"
              description="Start by uploading your CV in PDF or Word format. Our system accepts most standard resume formats."
              image="/placeholder.svg"
              imageAlt="Upload your CV"
            />
            
            <Step 
              number={2}
              title="AI Analysis"
              description="Our AI processes your CV, extracting key information about your experience, skills, education, and achievements."
              image="/placeholder.svg" 
              imageAlt="AI analyzes your CV"
              reverse
            />
            
            <Step 
              number={3}
              title="Website Generation"
              description="Based on the extracted data, we create a professional, responsive website that showcases your professional profile."
              image="/placeholder.svg"
              imageAlt="Website generation"
            />
            
            <Step 
              number={4}
              title="Get Your Unique URL"
              description="Within minutes, you'll receive a unique URL that you can share with recruiters, on social media, or add to your email signature."
              image="/placeholder.svg"
              imageAlt="Sharing your website"
              reverse
            />
          </div>
          
          <div className="mt-20 glass p-10 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to transform your CV?</h2>
            <p className="text-gray-300 mb-6">
              Join thousands of professionals who have enhanced their job applications with Adtechademy.
            </p>
            <Button asChild size="lg" className="bg-brand-red hover:bg-brand-red/90">
              <Link to="/upload">Upload Your CV Now</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-white/10 py-6 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© 2025 Adtechademy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const Step: React.FC<{
  number: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}> = ({ number, title, description, image, imageAlt, reverse = false }) => {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
      <div className="flex-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-red/10 text-brand-red font-bold text-xl mb-4">
          {number}
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-300 text-lg">{description}</p>
      </div>
      <div className="flex-1 glass rounded-xl overflow-hidden">
        <img src={image} alt={imageAlt} className="w-full h-auto" />
      </div>
    </div>
  );
};

export default HowItWorksPage;
