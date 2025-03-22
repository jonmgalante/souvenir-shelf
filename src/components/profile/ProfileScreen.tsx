
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Settings, LogOut, User, Mail, Info, ExternalLink, Loader2, Camera, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<{
    name: string | null;
    email: string | null;
    photoUrl: string | null;
  }>({
    name: null,
    email: null,
    photoUrl: null,
  });
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
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
        
        form.reset({
          name: profileInfo.name || '',
          email: profileInfo.email || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use user data from auth context as fallback
        const profileInfo = {
          name: user.name || null,
          email: user.email,
          photoUrl: user.photoUrl || null,
        };
        
        setProfileData(profileInfo);
        
        form.reset({
          name: profileInfo.name || '',
          email: profileInfo.email || '',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, form]);
  
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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    {profileData.photoUrl ? (
                      <AvatarImage src={profileData.photoUrl} alt={profileData.name || 'User'} />
                    ) : (
                      <AvatarFallback className="bg-secondary">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                        <Camera className="h-4 w-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Profile Photo</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={loading}
                        />
                        <p className="text-sm text-muted-foreground">
                          Upload a new profile photo. Max file size: 5MB.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="ml-4">
                  <h2 className="text-xl font-medium">{profileData.name || 'User'}</h2>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="mt-4 md:mt-0"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
            
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center border-b pb-2">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  This information is used to personalize your experience on Souvenir Shelf.
                </p>
              </div>
            )}
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
