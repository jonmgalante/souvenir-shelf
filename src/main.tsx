import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Capacitor } from '@capacitor/core'

// Initialize capacitor plugins when in a native environment
const initializeCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      const { SplashScreen } = await import('@capacitor/splash-screen')
      const { StatusBar } = await import('@capacitor/status-bar')
      
      // Keep splash screen visible while app initializes
      await SplashScreen.show({
        showDuration: 2000,
        autoHide: false
      })
      
      // Set status bar style
      await StatusBar.setStyle({ style: 'dark' })
      
      console.log('Capacitor initialized in native environment')
    } catch (error) {
      console.error('Error initializing Capacitor:', error)
    }
  }
}

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
document.title = 'SouvieShelf - Your Travel Archive';

// Run app initialization
const startApp = async () => {
  // Initialize Capacitor first in native environments
  await initializeCapacitor()
  
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
}

// Start the application
startApp();
