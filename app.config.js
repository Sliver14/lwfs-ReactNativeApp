// app.config.js
require('dotenv').config();

export default {
    expo: {
        name: "lwfs_app",
        slug: "lwfs_app",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "lwfsapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            package: "com.sliver14.lwfs_app"
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
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
            APP_NAME: process.env.APP_NAME
        }
    }
};
