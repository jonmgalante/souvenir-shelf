
import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

interface MobileContainerProps {
  children: React.ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Initialize and configure native plugins
      const setupNative = async () => {
        try {
          // Configure status bar
          await StatusBar.setStyle({ style: 'dark' });
          
          // Hide splash screen with fade
          await SplashScreen.hide({
            fadeOutDuration: 500
          });
          
          console.log('Native platform initialized');
        } catch (error) {
          console.error('Error initializing native components:', error);
        }
      };
      
      setupNative();
    }
  }, []);

  return (
    <div className="native-container min-h-screen flex flex-col">
      {/* SafeArea padding for iOS - applies only in native context */}
      <div className={`flex-1 ${Capacitor.isNativePlatform() ? 'pt-12 pb-8' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileContainer;
