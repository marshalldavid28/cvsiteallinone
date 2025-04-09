
import React from "react";

const NextStepsGuide: React.FC = () => {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
      <ol className="space-y-4">
        <li className="flex gap-3">
          <div className="bg-brand-red/10 text-brand-red rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
          <div>
            <p className="text-gray-200">We'll analyze your CV and extract the important information.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <div className="bg-brand-red/10 text-brand-red rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
          <div>
            <p className="text-gray-200">Our AI will design a personal website based on your professional profile and chosen style.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <div className="bg-brand-red/10 text-brand-red rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
          <div>
            <p className="text-gray-200">You'll get a unique URL that you can share with employers, colleagues, or on social media.</p>
          </div>
        </li>
      </ol>
    </div>
  );
};

export default NextStepsGuide;
