
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Grid, FolderPlus, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from './auth/LogoutButton';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-4xl font-serif font-medium mb-3">Souvenir Shelf</h1>
          <p className="text-muted-foreground mb-8">
            Your personal museum from a life well-traveled.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/collection')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <span className="font-medium">View Your Collection</span>
              <Grid className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => navigate('/map')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-input bg-card hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">Explore Your Map</span>
              <Map className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => navigate('/trips')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-input bg-card hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">Browse Trip Folders</span>
              <FolderPlus className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-input bg-card hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">Your Profile</span>
              <User className="h-5 w-5" />
            </button>

            {user && (
              <LogoutButton 
                variant="outline" 
                className="w-full flex items-center justify-between px-4 py-3" 
                showIcon={true}
              />
            )}
          </div>
        </div>
      </div>
      
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>Souvenir Shelf &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
