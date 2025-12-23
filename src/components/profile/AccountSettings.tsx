import React from 'react';
import { Settings, Info, ExternalLink, LogOut, Loader2, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AccountSettingsProps {
  onSignOut: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  loading: boolean;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  onSignOut,
  onDeleteAccount,
  loading
}) => {
  const confirmAndDelete = async () => {
    const ok = window.confirm(
      "Delete your account?\n\nThis will permanently delete your account and all saved souvenirs/trips. This cannot be undone."
    );
    if (!ok) return;

    await onDeleteAccount();
  };

  return (
    <>
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
            title: "About SouvieShelf",
            description: "A digital shelf for your physical souvenirs. Track, organize, and relive your travel memories.",
          })}
        >
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>About SouvieShelf</span>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={onSignOut}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg border border-input hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        <button
          onClick={confirmAndDelete}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Trash2 className="h-5 w-5" />
              <span>Delete Account</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default AccountSettings;