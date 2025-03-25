
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.souvieshelf',
  appName: 'SouvieShelf',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://souvieshelf.lovable.app?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: true,
    backgroundColor: '#FAFAF7',
    preferredContentMode: 'mobile',
    scheme: 'souvieshelf'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      showSpinner: false,
      backgroundColor: "#FAFAF7",
      spinnerColor: "#5F5741"
    },
    StatusBar: {
      backgroundColor: "#FAFAF7",
      style: "dark",
      overlaysWebView: false
    }
  }
};

export default config;
