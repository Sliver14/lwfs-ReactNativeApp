// app/(auth)/_layout.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function AuthLayout() {
    const { userToken, loading } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (Platform.OS === 'android') {
            navigation.setOptions({
                navigationBarColor: '#000000',
            });
        }
    }, [navigation]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <ActivityIndicator size="large" color="#facc15" />
                <Text style={{ marginTop: 10, color: '#fff' }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (userToken) {
        return <Redirect href="/(app)/(tabs)" />;
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <Stack 
                screenOptions={{ 
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: '#000'
                    }
                }}
            >
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="signin" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
                <Stack.Screen name="Verification" options={{ headerShown: false }} />
                <Stack.Screen name="SignupVerification" options={{ headerShown: false }} />
                <Stack.Screen name="ResetPassword" options={{ headerShown: false }} />
            </Stack>
            <Toast />
        </>
    );
}