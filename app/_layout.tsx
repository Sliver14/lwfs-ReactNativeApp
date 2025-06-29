// app/_layout.tsx
import { UserCartProvider } from "@/contexts/UserCartContext";
import { UserProvider } from "@/contexts/UserContext";
import {LiveTvProvider} from "@/contexts/LiveTvContext";
import * as Linking from 'expo-linking';
import { Slot, useRouter } from "expo-router";
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

export default function RootLayout() {
    const router = useRouter();
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

    return (
      <SafeAreaProvider>
        <AuthProvider>
            <UserProvider>
                    <UserCartProvider>
                        <LiveTvProvider>
                            <Slot />
                        </LiveTvProvider>

                    </UserCartProvider>
            </UserProvider>
        </AuthProvider>
      </SafeAreaProvider>
        
    )
}