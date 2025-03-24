
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force cache refresh for favicon
const link = document.querySelector("link[rel~='icon']");
if (link) {
  link.href = link.href + '?v=' + new Date().getTime();
}

createRoot(document.getElementById("root")!).render(<App />);
