// app/(app)/_layout.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppLayout() {
    const { userToken, loading } = useAuth();

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (!userToken) {
        return <Redirect href="/welcome" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Add other authenticated screens here */}
        </Stack>
    );
}