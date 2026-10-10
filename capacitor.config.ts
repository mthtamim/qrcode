import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pressmark.app',
  appName: 'Pressmark',
  webDir: '.vercel/output/static',
  bundledWebRuntime: false
};

export default config;
