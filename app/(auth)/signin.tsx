import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { API_URL } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

type FormData = {
    email: string;
    password: string;
};

type ForgotPasswordForm = {
    forgotEmail: string;
};

const SigninScreen = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [forgotModalVisible, setForgotModalVisible] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const { refetchUser } = useUser();
    const { login } = useAuth();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
    const { control: forgotControl, handleSubmit: handleForgotSubmit, reset: resetForgotForm, formState: { errors: forgotErrors } } = useForm<ForgotPasswordForm>();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        const loadEmail = async () => {
            const savedEmail = await SecureStore.getItemAsync('savedEmail');
            if (savedEmail) {
                setValue('email', savedEmail);
            }
        };
        loadEmail();
    }, []);

    const onButtonPressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onButtonPressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);

        try {
            console.log('Attempting signin with URL:', API_URL);
            
            const response = await axios.post(`${API_URL}/auth/signin`, {
                email: data.email,
                password: data.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Signin response:', response.data);

            const token = response.data.token;

            if (token) {
                await login(token);
                await SecureStore.setItemAsync('savedEmail', data.email);
                await AsyncStorage.setItem('isSignedIn', 'true');
                await refetchUser();

                Toast.show({
                    type: 'success',
                    text1: 'Sign-in Successful!',
                    visibilityTime: 2000,
                });

                router.replace({
                    pathname: "/(tabs)",
                    params: { reload: Date.now().toString() },
                });
            } else {
                console.error('No token in response:', response.data);
                Toast.show({
                    type: 'error',
                    text1: 'Sign-in Failed',
                    text2: 'Authentication token not received.',
                    visibilityTime: 4000,
                });
            }
        } catch (error: unknown) {
            console.error("Sign-in error:", error);

            if (axios.isAxiosError(error)) {
                console.error("Response data:", error.response?.data);
                console.error("Response status:", error.response?.status);
                console.error("Response headers:", error.response?.headers);

                const errorMessage = error.response?.data?.error ?? "Sign-in failed. Please try again.";
                Toast.show({
                    type: 'error',
                    text1: 'Sign-in Failed',
                    text2: errorMessage,
                    visibilityTime: 4000,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'An Unknown Error Occurred',
                    text2: 'Please try again later.',
                    visibilityTime: 4000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const onForgotPasswordSubmit = async (data: ForgotPasswordForm) => {
        setForgotLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, {
                email: data.forgotEmail,
            });

            Toast.show({
                type: 'success',
                text1: 'Password Reset Request Sent',
                text2: response.data.message || 'If an account exists, a reset link has been sent.',
                visibilityTime: 4000,
            });

            setForgotModalVisible(false);
            resetForgotForm();
        } catch (error: unknown) {
            console.error("Forgot Password Error:", error);

            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error ?? "Failed to send reset request. Please try again.";
                Toast.show({
                    type: 'error',
                    text1: 'Reset Request Failed',
                    text2: errorMessage,
                    visibilityTime: 4000,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'An Unknown Error Occurred',
                    text2: 'Please try again later.',
                    visibilityTime: 4000,
                });
            }
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#000' }}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <LinearGradient
                    colors={['#1e1b4b', '#3730a3', '#4f46e5']}
                    style={{ flex: 1 }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <ScrollView 
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Animated.View
                            style={{
                                flex: 1,
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                                paddingHorizontal: 24,
                                paddingTop: height * 0.1,
                                minHeight: height,
                            }}
                        >
                            <View className="absolute top-20 right-0 w-32 h-32 bg-white/5 rounded-full" />
                            <View className="absolute bottom-40 left-0 w-24 h-24 bg-white/5 rounded-full" />

                            <Animated.View
                                style={{
                                    alignItems: 'center',
                                    marginBottom: 48,
                                    transform: [{ scale: logoScale }],
                                }}
                            >
                                <Image
                                    source={require('@/assets/images/welcome/Logo-shadow.png')}
                                    style={{ width: 120, height: 120, resizeMode: 'contain' }}
                                />
                                <View style={{ alignItems: 'center', marginTop: 16 }}>
                                    <Text style={{ color: '#facc15', fontSize: 20, fontWeight: '600' }}>
                                        LOVEWORLD
                                    </Text>
                                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                                        FOUNDATION SCHOOL
                                    </Text>
                                </View>
                            </Animated.View>

                            <View style={{ marginBottom: 32 }}>
                                <View className="mb-6">
                                    <View
                                        className={`relative bg-white/90 rounded-2xl border-2 ${
                                            emailFocused ? 'border-yellow-400 shadow-lg' : 'border-transparent'
                                        } transition-all duration-200`}
                                    >
                                        <Ionicons
                                            name="mail-outline"
                                            size={20}
                                            color={emailFocused ? '#f59e0b' : '#6b7280'}
                                            style={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                                        />
                                        <Controller
                                            control={control}
                                            name="email"
                                            rules={{
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^\S+@\S+$/i,
                                                    message: 'Please enter a valid email',
                                                },
                                            }}
                                            render={({ field: { onChange, value, onBlur } }) => (
                                                <TextInput
                                                    className="pl-12 pr-4 py-4 text-base text-gray-800 font-medium"
                                                    placeholder="Email Address"
                                                    placeholderTextColor="#9ca3af"
                                                    onChangeText={onChange}
                                                    value={value || ''}
                                                    autoCapitalize="none"
                                                    keyboardType="email-address"
                                                    onBlur={() => {
                                                        onBlur();
                                                        setEmailFocused(false);
                                                    }}
                                                />
                                            )}
                                        />
                                    </View>
                                    {errors.email && (
                                        <Text className="text-red-400 mt-2 ml-2 font-medium">{errors.email.message}</Text>
                                    )}
                                </View>

                                <View className="mb-6">
                                    <View
                                        className={`relative bg-white/90 rounded-2xl border-2 ${
                                            passwordFocused ? 'border-yellow-400 shadow-lg' : 'border-transparent'
                                        } transition-all duration-200`}
                                    >
                                        <Ionicons
                                            name="lock-closed-outline"
                                            size={20}
                                            color={passwordFocused ? '#f59e0b' : '#6b7280'}
                                            style={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                                        />
                                        <Controller
                                            control={control}
                                            name="password"
                                            rules={{
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 4,
                                                    message: 'Password must be at least 4 characters',
                                                },
                                            }}
                                            render={({ field: { onChange, value, onBlur } }) => (
                                                <TextInput
                                                    className="pl-12 pr-12 py-4 text-base text-gray-800 font-medium"
                                                    placeholder="Password"
                                                    placeholderTextColor="#9ca3af"
                                                    onChangeText={onChange}
                                                    value={value || ''}
                                                    secureTextEntry={!showPassword}
                                                    onBlur={() => {
                                                        onBlur();
                                                        setPasswordFocused(false);
                                                    }}
                                                />
                                            )}
                                        />
                                        <TouchableOpacity
                                            className="absolute right-4 top-4"
                                            onPress={() => setShowPassword(!showPassword)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                                size={22}
                                                color="#6b7280"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {errors.password && (
                                        <Text className="text-red-400 mt-2 ml-2 font-medium">{errors.password.message}</Text>
                                    )}
                                </View>
                            </View>

                            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                <TouchableOpacity
                                    className="rounded-2xl overflow-hidden shadow-lg"
                                    disabled={loading}
                                    onPress={handleSubmit(onSubmit)}
                                    onPressIn={onButtonPressIn}
                                    onPressOut={onButtonPressOut}
                                    activeOpacity={0.9}
                                >
                                    <LinearGradient
                                        colors={loading ? ['#9ca3af', '#6b7280'] : ['#f59e0b', '#f97316']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{
                                            paddingVertical: 16,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#ffffff',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {loading ? 'Signing In...' : 'Sign In'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>

                            <View className="items-center mt-8 gap-4 space-y-4">
                                <TouchableOpacity
                                    onPress={() => router.push('/signup')}
                                    activeOpacity={0.7}
                                    className="bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20"
                                >
                                    <Text className="text-white font-semibold text-center">
                                        New here? <Text className="text-yellow-300 font-bold">Create Account</Text>
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setForgotModalVisible(true)}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-white/70 font-medium">Forgot your password?</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </LinearGradient>
            </KeyboardAvoidingView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={forgotModalVisible}
                onRequestClose={() => setForgotModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-2xl p-6 w-[90%]">
                        <Text className="text-xl font-bold mb-4">Reset Password</Text>
                        <View className="mb-6">
                            <View className="relative bg-white rounded-2xl border-2 border-gray-300">
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color="#6b7280"
                                    style={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                                />
                                <Controller
                                    control={forgotControl}
                                    name="forgotEmail"
                                    rules={{
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Please enter a valid email',
                                        },
                                    }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <TextInput
                                            className="pl-12 pr-4 py-4 text-base text-gray-800 font-medium"
                                            placeholder="Enter your email"
                                            placeholderTextColor="#9ca3af"
                                            onChangeText={onChange}
                                            value={value || ''}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            onBlur={onBlur}
                                        />
                                    )}
                                />
                            </View>
                            {forgotErrors.forgotEmail && (
                                <Text className="text-red-400 mt-2 ml-2 font-medium">
                                    {forgotErrors.forgotEmail.message}
                                </Text>
                            )}
                        </View>
                        <View className="flex-row gap-5 justify-end space-x-3">
                            <TouchableOpacity
                                className="bg-gray-200 rounded-lg px-4 py-2"
                                onPress={() => {
                                    setForgotModalVisible(false);
                                    resetForgotForm();
                                }}
                            >
                                <Text className="text-gray-800 font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-[#4f46e5] rounded-lg px-4 py-2"
                                onPress={handleForgotSubmit(onForgotPasswordSubmit)}
                                disabled={forgotLoading}
                            >
                                <Text className="text-white font-medium">
                                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Toast />
        </SafeAreaView>
    );
};

export default SigninScreen;