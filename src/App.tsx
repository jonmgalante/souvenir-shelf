
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth"; // Updated import path
import { SouvenirProvider } from "./context/souvenir";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

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

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SouvenirProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthScreen />} />
                
                {/* Main routes */}
                <Route path="/collection" element={<Layout><SouvenirGrid /></Layout>} />
                <Route path="/souvenir/:id" element={<Layout><SouvenirDetail /></Layout>} />
                <Route path="/add" element={<Layout><AddSouvenir /></Layout>} />
                <Route path="/map" element={<Layout><MapView /></Layout>} />
                <Route path="/trips" element={<Layout><TripFolders /></Layout>} />
                <Route path="/trip/:id" element={<Layout><TripDetail /></Layout>} />
                <Route path="/profile" element={<Layout><ProfileScreen /></Layout>} />
                
                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SouvenirProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
