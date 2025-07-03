// app/_layout.tsx
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { LiveTvProvider } from "@/contexts/LiveTvContext";
import { UserCartProvider } from "@/contexts/UserCartContext";
import { UserProvider } from "@/contexts/UserContext";
import { VideoPlayerProvider } from '@/contexts/VideoPlayerContext';
import * as Linking from 'expo-linking';
import { Stack, useRouter } from "expo-router"; // Import Stack
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native'; // For loading state
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message'; // Import Toast here
import "./globals.css";

// This component will handle the top-level routing logic based on auth state
function RootNavigator() {
    const { userToken, loading } = useAuth(); // Use auth context to determine initial route
    const router = useRouter(); // useRouter is now available because of the Stack below

    // Deep linking logic remains the same
    useEffect(() => {
        const subscription = Linking.addEventListener('url', ({ url }) => {
            const parsed = Linking.parse(url);
            if (parsed.path === 'payment-success') {
                router.push('/payment-success');
            } else if (parsed.path === 'payment-failed') {
                router.push('/payment-failed');
            }
        });

        return () => subscription.remove();
    }, []);

    // You can also add your initial loading/redirect logic here
    // For example, if you need to show a splash screen while auth loads
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1b4b' }}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ marginTop: 10, color: '#fff' }}>Loading application...</Text>
            </View>
        );
    }

    // Define your top-level stack navigator
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/*
        This Stack.Screen defines your (auth) group.
        Expo Router will look for app/(auth)/_layout.tsx to handle the screens within this group.
      */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            {/*
        This Stack.Screen defines your (app) group (for authenticated users).
        Expo Router will look for app/(app)/_layout.tsx to handle the screens within this group.
      */}
            <Stack.Screen name="(app)" options={{ headerShown: false }} />

            {/*
        Add specific deep link target screens here if they are not part of (auth) or (app) group,
        or if you want them to be accessible globally.
        Make sure you have app/payment-success.tsx and app/payment-failed.tsx files.
      */}
            <Stack.Screen name="payment-success" options={{ headerShown: false }} />
            <Stack.Screen name="payment-failed" options={{ headerShown: false }} />

            {/*
        If you have an index.tsx or other top-level routes that aren't inside groups,
        define them here.
        Example: <Stack.Screen name="index" options={{ headerShown: false }} />
      */}
        </Stack>
    );
}

export default function RootLayoutWrapper() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <UserProvider>
                    <UserCartProvider>
                        <LiveTvProvider>
                            <VideoPlayerProvider>
                                <Stack>
                                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                                    <Stack.Screen name="(app)" options={{ headerShown: false }} />
                                </Stack>
                            </VideoPlayerProvider>
                        </LiveTvProvider>
                    </UserCartProvider>
                </UserProvider>
            </AuthProvider>
            <Toast /> {/* Toast should be outside the navigator but inside SafeAreaProvider/main wrappers */}
        </SafeAreaProvider>
    );
}