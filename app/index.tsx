// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { userToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (userToken) {
        router.replace('/(tabs)');
      } else {
        router.replace('/welcome');
      }
    }
  }, [loading, userToken, router]);

  // Show loading spinner while determining auth state or navigating
  return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
  );
}