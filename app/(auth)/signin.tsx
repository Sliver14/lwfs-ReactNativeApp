import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, Dimensions, StatusBar } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/utils/env';

const { width, height } = Dimensions.get('window');


type FormData = {
    email: string;
    password: string;
};

const SigninScreen = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const errorShake = useRef(new Animated.Value(0)).current;

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

    useEffect(() => {
        // Initial animations
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

    // Shake animation for errors
    const shakeError = () => {
        Animated.sequence([
            Animated.timing(errorShake, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(errorShake, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(errorShake, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(errorShake, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    // Button press animation
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
        setErrorMsg('');

        // Save email to AsyncStorage for verification or future use
        // await AsyncStorage.setItem('email', data.email);

        try {
            const response = await axios.post(`${API_URL}/auth/signin`, {
                email: data.email,
                password: data.password,
            });

            const token = response.data.token;
            // Save email to AsyncStorage for verification or future use
            // await AsyncStorage.setItem('email', data.email);

            if (token) {
                await SecureStore.setItemAsync('userToken', token);
                // await SecureStore.setItemAsync('savedEmail', data.email);

                router.replace("/(tabs)");
            } else {
                setErrorMsg('Token not received from server.');
                shakeError();
            }
        } catch (error: unknown) {
            console.error("Sign-in error:", error);

            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error ?? "Sign-in failed";

                if (errorMessage.includes("User not verified")) {
                    try{
                        await axios.post(`${API_URL}/auth/resendcode`, {email: data.email});
                        // setSuccess(response.data.message || "Resend Succeessful")
                        setErrorMsg("User not verified. Redirecting to verification...");
                        setTimeout(() => router.push("/(auth)/SignupVerification"), 2000);
                    }catch(error){
                        if (axios.isAxiosError(error)) {
                            setErrorMsg(error.response?.data?.error || "Resend failed");
                        } else {
                            setErrorMsg("An unknown error occurred.");
                        }
                    }


                } else {
                    setErrorMsg(errorMessage);
                }
            } else {
                setErrorMsg("An unknown error occurred.");
            }
            shakeError();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
            <LinearGradient
                colors={['#1e1b4b', '#3730a3', '#4f46e5']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Animated.View
                    style={{
                        flex: 1,
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }}
                    className="px-6 py-10 justify-center"
                >
                    {/* Background Decorative Elements */}
                    <View className="absolute top-20 right-0 w-32 h-32 bg-white/5 rounded-full" />
                    <View className="absolute bottom-40 left-0 w-24 h-24 bg-white/5 rounded-full" />

                    {/* Logo with Animation */}
                    <Animated.View
                        style={{
                            transform: [{ scale: logoScale }],
                            alignItems: 'center',
                            marginBottom: 32
                        }}
                    >
                        <View className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl">
                            <Image
                                source={require('@/assets/images/welcome/Logo-shadow.png')}
                                className="w-[80px] h-[80px]"
                                resizeMode="contain"
                            />
                        </View>
                    </Animated.View>

                    {/* Welcome Text */}
                    <View className="items-center mb-10">
                        <Text className="text-4xl font-bold text-white mb-2">Welcome Back!</Text>
                        <Text className="text-lg text-white/70">Sign in to continue your journey</Text>
                    </View>

                    {/* Form Container */}
                    <View className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                        {/* Email Field */}
                        <View className="mb-6">
                            <View className={`relative bg-white/90 rounded-2xl border-2 ${
                                emailFocused ? 'border-yellow-400 shadow-lg' : 'border-transparent'
                            } transition-all duration-200`}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={emailFocused ? "#f59e0b" : "#6b7280"}
                                    style={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                                />
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Please enter a valid email'
                                        }
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            className="pl-12 pr-4 py-4 text-base text-gray-800 font-medium"
                                            placeholder="Email Address"
                                            placeholderTextColor="#9ca3af"
                                            onChangeText={onChange}
                                            value={value || ''}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            // onFocus={() => setEmailFocused(true)}
                                            // onBlur={() => setEmailFocused(false)}
                                        />
                                    )}
                                />
                            </View>
                            {errors.email && (
                                <Animated.Text
                                    style={{ transform: [{ translateX: errorShake }] }}
                                    className="text-yellow-300 mt-2 ml-2 font-medium"
                                >
                                    {errors.email.message}
                                </Animated.Text>
                            )}
                        </View>

                        {/* Password Field */}
                        <View className="mb-6">
                            <View className={`relative bg-white/90 rounded-2xl border-2 ${
                                passwordFocused ? 'border-yellow-400 shadow-lg' : 'border-transparent'
                            } transition-all duration-200`}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={passwordFocused ? "#f59e0b" : "#6b7280"}
                                    style={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                                />
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{
                                        required: 'Password is required',
                                        minLength: {
                                            value: 4,
                                            message: 'Password must be at least 4 characters'
                                        }
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            className="pl-12 pr-12 py-4 text-base text-gray-800 font-medium"
                                            placeholder="Password"
                                            placeholderTextColor="#9ca3af"
                                            onChangeText={onChange}
                                            value={value || ''}
                                            secureTextEntry={!showPassword}
                                            // onFocus={() => setPasswordFocused(true)}
                                            // onBlur={() => setPasswordFocused(false)}
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
                                <Animated.Text
                                    style={{ transform: [{ translateX: errorShake }] }}
                                    className="text-yellow-300 mt-2 ml-2 font-medium"
                                >
                                    {errors.password.message}
                                </Animated.Text>
                            )}
                        </View>

                        {/* Error Message */}
                        {errorMsg ? (
                            <Animated.View
                                style={{ transform: [{ translateX: errorShake }] }}
                                className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 mb-6"
                            >
                                <Text className="text-red-300 text-center font-medium">{errorMsg}</Text>
                            </Animated.View>
                        ) : null}

                        {/* Submit Button */}
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
                                    <Text style={{
                                        color: '#ffffff',
                                        fontSize: 18,
                                        fontWeight: 'bold'
                                    }}>
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {/* Links */}
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
                            onPress={() => router.push('/resetpassword')}
                            activeOpacity={0.7}
                        >
                            <Text className="text-white/70 font-medium">
                                Forgot your password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </LinearGradient>
        </>
    );
};

export default SigninScreen;