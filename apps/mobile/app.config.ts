import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "the-learning-app",
    slug: "the-learning-app",
    version: "0.0.0",
    orientation: "portrait",
    // icon: "./assets/icon.png", // TODO: Add app icon
    userInterfaceStyle: "automatic",
    splash: {
        // image: "./assets/splash.png", // TODO: Add splash screen
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
            // foregroundImage: "./assets/adaptive-icon.png", // TODO: Add adaptive icon
            backgroundColor: "#ffffff",
        },
        package: "com.hdrwilkinson.learningapp",
    },
    web: {
        // favicon: "./assets/favicon.png", // TODO: Add favicon
        bundler: "metro",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
        typedRoutes: true,
    },
    scheme: "thelearningapp",
});
