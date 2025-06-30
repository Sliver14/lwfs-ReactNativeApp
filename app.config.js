// app.config.js
require('dotenv').config();

export default {
    expo: {
        name: "Loveworld Foundation School",
        slug: "Loveworld-Foundation-School",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/logo.png",
        scheme: "lwfs_app",
        deepLinking: true,
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            package: "com.sliver14.lwfs_app"
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/icon.png"
        },
        plugins: [
            "expo-router",
            "expo-web-browser",
            "expo-video",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ],
            "react-native-video",
            "expo-secure-store"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            API_URL: process.env.API_URL,
            APP_NAME: process.env.APP_NAME,
            eas: {
                projectId: "d8b0d498-7935-4f85-ae24-7deac0b03abf"
            }
        }
    }
};
