
import React from 'react';
import { User, Camera } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  profileData: {
    name: string | null;
    email: string | null;
    photoUrl: string | null;
  };
  isEditing: boolean;
  loading: boolean;
  onEditToggle: () => void;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  isEditing,
  loading,
  onEditToggle,
  onPhotoUpload
}) => {
  return (
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
                  onChange={onPhotoUpload}
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
        onClick={onEditToggle}
      >
        {isEditing ? 'Cancel' : 'Edit Profile'}
      </Button>
    </div>
  );
};

export default ProfileHeader;
