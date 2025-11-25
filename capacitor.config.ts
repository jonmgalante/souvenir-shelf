
import { CapacitorConfig } from '@capacitor/cli';
import { Style } from '@capacitor/status-bar';

const config: CapacitorConfig = {
  appId: 'com.souvieshelf.app',
  appName: 'SouvieShelf',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // No remote URL in production – load bundled web assets from /dist
    // This line is only really needed for Android but harmless here:
  androidScheme: 'https',
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
      style: Style.Dark,
      overlaysWebView: false
    }
  }
};

export default config;
