import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nursenote.ai',
  appName: 'NurseNote AI',
  webDir: 'client/dist',

  // Load the deployed Vercel app so Groq API calls and Web Speech API work.
  // Replace this URL with your actual Vercel deployment URL.
  server: {
    url: 'https://nursenote-ai.vercel.app',
    cleartext: false,
  },

  android: {
    // Allow the WebView to make HTTPS calls to the Groq API
    allowMixedContent: false,
    // Keep screen on while recording
    captureInput: true,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
