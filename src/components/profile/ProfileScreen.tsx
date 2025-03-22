
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Settings, LogOut, User, Mail, Info, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<{
    name: string | null;
    email: string | null;
    photoUrl: string | null;
  }>({
    name: null,
    email: null,
    photoUrl: null,
  });
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email, photo_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setProfileData({
          name: data.name || user.name,
          email: data.email || user.email,
          photoUrl: data.photo_url || user.photoUrl,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use user data from auth context as fallback
        setProfileData({
          name: user.name || null,
          email: user.email,
          photoUrl: user.photoUrl || null,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <div className="souvenir-container animate-fade-in">
      <h1 className="page-title">Your Profile</h1>
      
      <div className="glass-card rounded-xl p-6 mb-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center mb-6">
              <div className="relative">
                {profileData.photoUrl ? (
                  <img
                    src={profileData.photoUrl}
                    alt={profileData.name || 'User'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="ml-4">
                <h2 className="text-xl font-medium">{profileData.name || 'User'}</h2>
                <p className="text-sm text-muted-foreground">{profileData.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{profileData.email}</span>
              </div>
            </div>
          </>
        )}
      </div>
      
      <h2 className="text-xl font-serif font-medium mb-4">Account Settings</h2>
      
      <div className="space-y-2 mb-8">
        <button 
          className="w-full flex items-center justify-between p-4 rounded-lg border border-input hover:bg-secondary/50 transition-colors text-left"
          onClick={() => toast({
            title: "Coming Soon",
            description: "This feature is not yet available.",
          })}
        >
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>App Settings</span>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <button 
          className="w-full flex items-center justify-between p-4 rounded-lg border border-input hover:bg-secondary/50 transition-colors text-left"
          onClick={() => toast({
            title: "About Souvenir Shelf",
            description: "A digital shelf for your physical souvenirs. Track, organize, and relive your travel memories.",
          })}
        >
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>About Souvenir Shelf</span>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ProfileScreen;
