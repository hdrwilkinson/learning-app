import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "learning-app",
    slug: "learning-app",
    version: "0.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.hdrwilkinson.learningapp",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        package: "com.hdrwilkinson.learningapp",
    },
    web: {
        favicon: "./assets/favicon.png",
        bundler: "metro",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
        typedRoutes: true,
    },
    scheme: "learningapp",
});
