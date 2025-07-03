// app/_layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { LiveTvProvider } from '@/contexts/LiveTvContext';
import { UserCartProvider } from '@/contexts/UserCartContext';
import { UserProvider } from '@/contexts/UserContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./globals.css";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <UserProvider>
                    <UserCartProvider>
                        <LiveTvProvider>
                            <Stack screenOptions={{ headerShown: false }} />
                            <StatusBar style="auto" />
                        </LiveTvProvider>
                    </UserCartProvider>
                </UserProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}