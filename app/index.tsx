import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const { userToken, loading: authLoading } = useAuth();
  const { userId, refetchUser } = useUser();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await refetchUser();
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [refetchUser]);

  useEffect(() => {
    if (!authLoading && !isCheckingAuth) {
      const checkRedirect = async () => {
        const isSignedIn = await AsyncStorage.getItem('isSignedIn');
        console.log('userToken:', userToken, 'userId:', userId, 'isSignedIn:', isSignedIn);
        if (userToken && userId || isSignedIn === 'true') {
          router.replace({
            pathname: '/(tabs)',
            params: { reload: Date.now().toString() },
          });
        } else {
          router.replace('/welcome');
        }
      };
      checkRedirect();
    }
  }, [authLoading, isCheckingAuth, userToken, userId, router]);

  return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
  );
}