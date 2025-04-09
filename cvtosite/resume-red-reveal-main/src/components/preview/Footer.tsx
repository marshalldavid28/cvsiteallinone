
import React from 'react';

interface FooterProps {
  name: string;
  theme?: 'dark' | 'light';
}

const Footer: React.FC<FooterProps> = ({ name, theme = 'dark' }) => {
  return (
    <footer className={`py-8 px-4 border-t ${theme === 'dark' ? 'border-white/10 bg-brand-darker' : 'border-gray-200 bg-white'}`}>
      <div className="max-w-5xl mx-auto text-center">
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>© 2025 {name} • Made with Adtechademy</p>
      </div>
    </footer>
  );
};

export default Footer;
