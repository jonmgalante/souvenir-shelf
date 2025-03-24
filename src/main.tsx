
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Handle direct access to index.html by redirecting immediately
if (window.location.pathname === '/' || 
    window.location.pathname === '/index' || 
    window.location.pathname === '/index.html') {
  console.log('main.tsx: Root or index path detected, redirecting to collection');
  window.location.replace('/collection');
}

// Force cache refresh for favicon
const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (link) {
  link.href = link.href + '?v=' + new Date().getTime();
}

// Set the page title
document.title = 'SouvieShelf';

// Clear any existing root content before rendering
const rootElement = document.getElementById("root")!;
if (rootElement) {
  // Clear any existing content
  rootElement.innerHTML = '';
  
  // Render the app
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found - this may cause rendering issues");
  // Create a root element if it doesn't exist (fallback for some browser issues)
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  createRoot(newRoot).render(<App />);
}
