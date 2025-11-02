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
    extra: {
        // EAS project configuration
        eas: {
            projectId: "b276d10e-8d36-46dd-b440-0f80b1257785",
        },
        // OAuth configuration - these will be available via expo-constants
        googleOAuthClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
        googleOAuthClientIdAndroid:
            process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || "",
        googleOAuthClientIdIOS:
            process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || "",
        apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
    },
});
