import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rahal.kwt",
  appName: "رحال",
  webDir: "out",
  server: {
    url: "https://rahal-kwt.web.app/app/discover",
    cleartext: false,
  },
  android: {
    backgroundColor: "#020617",
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#020617",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#020617",
      overlaysWebView: false,
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "960621946307-jm9ppsofqhtt4jjvldhrill5mkjb83hm.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
