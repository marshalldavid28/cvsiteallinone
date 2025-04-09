
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

// Create root with explicit React import to ensure React is available
const root = createRoot(document.getElementById("root")!);

// Render with StrictMode to help catch potential issues
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
