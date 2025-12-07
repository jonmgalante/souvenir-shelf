import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth"; 
import { SouvenirProvider } from "./context/souvenir";
import usePageTitle from "./hooks/usePageTitle";
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";

// Components
import Layout from "./components/Layout";
import AuthScreen from "./components/auth/AuthScreen";
import SouvenirGrid from "./components/souvenirs/SouvenirGrid";
import SouvenirDetail from "./components/souvenirs/SouvenirDetail";
import AddSouvenir from "./components/souvenirs/AddSouvenir";
import MapView from "./components/map/MapView";
import TripFolders from "./components/trips/TripFolders";
import TripDetail from "./components/trips/TripDetail";
import ProfileScreen from "./components/profile/ProfileScreen";
import NotFound from "./pages/NotFound";
import OfflineIndicator from "./components/common/OfflineIndicator";
import AddTrip from "./components/trips/AddTrip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      // Keep stale data available when offline
      staleTime: Capacitor.isNativePlatform() ? 1000 * 60 * 60 * 24 : 1000 * 60 * 5, // 24 hours in native, 5 minutes in web
      // Use cached data when offline
      networkMode: 'online',
    },
  },
});

const AppContent = () => {
  // Set default app title
  usePageTitle();
  
  return (
    <>
      <OfflineIndicator />
      <Routes>
        {/* Root and index routes - redirect to collection */}
        <Route path="/" element={<Navigate to="/collection" replace />} />
        <Route path="/index" element={<Navigate to="/collection" replace />} />
        <Route path="/index.html" element={<Navigate to="/collection" replace />} />
        
        <Route path="/auth" element={<AuthScreen />} />
        
        {/* Main routes */}
        <Route path="/collection" element={<Layout><SouvenirGrid /></Layout>} />
        <Route path="/souvenir/:id" element={<Layout><SouvenirDetail /></Layout>} />
        <Route path="/add" element={<Layout><AddSouvenir /></Layout>} />
        <Route path="/map" element={<Layout><MapView /></Layout>} />
        <Route path="/trips" element={<Layout><TripFolders /></Layout>} />
        <Route path="/trip/:id" element={<Layout><TripDetail /></Layout>} />
        <Route path="/profile" element={<Layout><ProfileScreen /></Layout>} />
        <Route path="/trips/new" element={<Layout><AddTrip /></Layout>} />
        
        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SouvenirProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename="/">
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </SouvenirProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
