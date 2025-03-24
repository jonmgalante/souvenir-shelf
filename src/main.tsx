
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force cache refresh for favicon
const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (link) {
  link.href = link.href + '?v=' + new Date().getTime();
}

// Also update the page title directly to ensure it's set
document.title = 'SouvieShelf';

createRoot(document.getElementById("root")!).render(<App />);
