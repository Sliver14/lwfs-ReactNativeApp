// app.config.js
require('dotenv').config();

module.exports = {
    expo: {
        name: "Loveworld Foundation School",
        slug: "lwfs_app",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/images/welcome/Logo-shadow.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.lwfs.app",
            infoPlist: {
                NSCameraUsageDescription: "This app uses the camera to capture photos for user profile and content sharing.",
                NSPhotoLibraryUsageDescription: "This app accesses your photos to let you share them with your friends.",
                NSMicrophoneUsageDescription: "This app uses the microphone to record audio for video playback."
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.lwfs.app",
            permissions: [
                "CAMERA",
                "READ_EXTERNAL_STORAGE",
                "WRITE_EXTERNAL_STORAGE",
                "RECORD_AUDIO"
            ]
        },
        web: {
            favicon: "./assets/images/icon.png"
        },
        plugins: [
            "expo-av",
            "expo-screen-orientation"
        ],
        extra: {
            API_URL: process.env.API_URL,
            APP_NAME: process.env.APP_NAME,
            eas: {
                projectId: "your-project-id"
            }
        }
    }
};
