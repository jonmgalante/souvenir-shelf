import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useProfileData from './useProfileData';
import ProfileHeader from './ProfileHeader';
import ProfileForm from './ProfileForm';
import ProfileInfo from './ProfileInfo';
import AccountSettings from './AccountSettings';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    loading,
    isEditing,
    profileData,
    setIsEditing,
    handleSignOut,
    handleDeleteAccount,   // ✅ add this
    handleProfileUpdate,
    handlePhotoUpload,
  } = useProfileData();

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
            <ProfileHeader
              profileData={profileData}
              isEditing={isEditing}
              loading={loading}
              onEditToggle={() => setIsEditing(!isEditing)}
              onPhotoUpload={handlePhotoUpload}
            />

            {isEditing ? (
              <ProfileForm
                defaultValues={{
                  name: profileData.name || '',
                  email: profileData.email || '',
                }}
                loading={loading}
                onSubmit={handleProfileUpdate}
              />
            ) : (
              <ProfileInfo email={profileData.email} />
            )}
          </>
        )}
      </div>

      <AccountSettings
        onSignOut={handleSignOut}
        onDeleteAccount={handleDeleteAccount}  // ✅ add this
        loading={loading}
      />
    </div>
  );
};

export default ProfileScreen;