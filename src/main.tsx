
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
}
