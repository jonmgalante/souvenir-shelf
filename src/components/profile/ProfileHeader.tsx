
import React, { useState } from 'react';
import { User, Camera, Pencil } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ImageCropper from '../common/ImageCropper';

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
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploadEvent, setUploadEvent] = useState<React.ChangeEvent<HTMLInputElement> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setTempPhotoUrl(URL.createObjectURL(file));
      setUploadEvent(event);
      setShowCropper(true);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    // Convert cropped blob URL to File object
    const response = await fetch(croppedImageUrl);
    const blob = await response.blob();
    
    // Create a new File from the cropped blob
    const file = new File([blob], "profile-photo.jpg", { type: 'image/jpeg' });
    
    // Create a new event with the cropped file
    if (uploadEvent) {
      // Create a new DataTransfer object and add our file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Create a clone of the original event
      const newEvent = {...uploadEvent} as React.ChangeEvent<HTMLInputElement>;
      
      // Set the files property to our DataTransfer files
      Object.defineProperty(newEvent.target, 'files', {
        value: dataTransfer.files,
        writable: false
      });
      
      // Call the original onPhotoUpload with our new event
      await onPhotoUpload(newEvent);
    }
    
    // Clean up
    setShowCropper(false);
    setTempPhotoUrl(null);
    setUploadEvent(null);
    setIsDialogOpen(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempPhotoUrl(null);
    setUploadEvent(null);
  };

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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                {!showCropper && (
                  <>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload a new profile photo. Max file size: 5MB.
                    </p>
                  </>
                )}
                
                {tempPhotoUrl && (
                  <ImageCropper
                    imageUrl={tempPhotoUrl}
                    aspectRatio={1}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                    open={showCropper}
                  />
                )}
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
