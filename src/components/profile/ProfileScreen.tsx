
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Settings, LogOut, User, Mail, Info, ExternalLink } from 'lucide-react';

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <div className="souvenir-container animate-fade-in">
      <h1 className="page-title">Your Profile</h1>
      
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="relative">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name || 'User'}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="ml-4">
            <h2 className="text-xl font-medium">{user.name || 'User'}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-serif font-medium mb-4">Account Settings</h2>
      
      <div className="space-y-2 mb-8">
        <button className="w-full flex items-center justify-between p-4 rounded-lg border border-input hover:bg-secondary/50 transition-colors text-left">
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>App Settings</span>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <button className="w-full flex items-center justify-between p-4 rounded-lg border border-input hover:bg-secondary/50 transition-colors text-left">
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>About Souvenir Shelf</span>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default ProfileScreen;
