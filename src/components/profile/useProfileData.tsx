
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ProfileFormValues } from './ProfileForm';

export interface ProfileData {
  name: string | null;
  email: string | null;
  photoUrl: string | null;
}

export const useProfileData = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
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
        
        const profileInfo = {
          name: data.name || user.name,
          email: data.email || user.email,
          photoUrl: data.photo_url || user.photoUrl,
        };
        
        setProfileData(profileInfo);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use user data from auth context as fallback
        const profileInfo = {
          name: user.name || null,
          email: user.email,
          photoUrl: user.photoUrl || null,
        };
        
        setProfileData(profileInfo);
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

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          email: values.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setProfileData({
        ...profileData,
        name: values.name,
        email: values.email,
      });
      
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    
    setLoading(true);
    try {
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      if (!data) throw new Error('Failed to get public URL');
      
      const photoUrl = data.publicUrl;
      
      // Update the profile with the new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      setProfileData({
        ...profileData,
        photoUrl,
      });
      
      toast({
        title: "Photo updated",
        description: "Your profile photo has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Photo upload failed",
        description: error.message || "An error occurred while uploading your photo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isEditing,
    profileData,
    setIsEditing,
    handleSignOut,
    handleProfileUpdate,
    handlePhotoUpload,
  };
};

export default useProfileData;
