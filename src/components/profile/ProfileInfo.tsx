
import React from 'react';
import { Mail } from 'lucide-react';

interface ProfileInfoProps {
  email: string | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ email }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center border-b pb-2">
        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
        <span>{email}</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        This information is used to personalize your experience on Souvenir Shelf.
      </p>
    </div>
  );
};

export default ProfileInfo;
