import React from 'react';
import { LogOut, Loader2, Trash2 } from 'lucide-react';

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
      <h2 className="text-xl font-serif font-medium mb-4">Account</h2>

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