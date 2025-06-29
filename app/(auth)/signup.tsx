import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Animated, Dimensions, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import country from "../../utils/country";
import zones from "../../utils/zones";
import axios, { AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/utils/env';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

interface SignupFormValues {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    zone: string;
    country: string;
    city: string;
    church: string;
    email: string;
    kcUsername: string;
    password: string;
    confirmPassword: string;
}

// Validation schemas for each step
const step1ValidationSchema = Yup.object({
    firstName: Yup.string()
        .trim()
        .matches(/^[A-Za-z\s]+$/, "First Name must contain only letters")
        .required("First Name is required"),
    lastName: Yup.string()
        .trim()
        .matches(/^[A-Za-z\s]+$/, "Last Name must contain only letters")
        .required("Last Name is required"),
    phoneNumber: Yup.string()
        .max(15, "Phone number must not exceed 15 digits")
        .matches(/^\d+$/, "Phone number must contain only numbers")
        .required("Phone number is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
});

const step2ValidationSchema = Yup.object({
    zone: Yup.string().required("Zone is required"),
    church: Yup.string().required("Church is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    kcUsername: Yup.string().min(3, "Kingschat ID must be at least 3 characters").required("Kingschat ID is required"),
    password: Yup.string().min(4, "Password must be at least 4 characters").required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

const SignupScreen = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});
    const [currentStep, setCurrentStep] = useState(1);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        trigger,
        resetField,
    } = useForm<SignupFormValues>({
        resolver: yupResolver(currentStep === 1 ? step1ValidationSchema : step2ValidationSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            zone: "",
            country: "Nigeria",
            city: "",
            church: "",
            email: "",
            kcUsername: "",
            password: "",
            confirmPassword: "",
        },
    });

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

        const subscription = watch((value) => {
            if (value.email && currentStep === 2) {
                AsyncStorage.setItem('email', value.email).catch(console.error);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, currentStep]);

    useEffect(() => {
        if (currentStep === 2) {
            // Clear Step 2 fields when switching to Step 2
            resetField("zone");
            resetField("church");
            resetField("email");
            resetField("kcUsername");
            resetField("password");
            resetField("confirmPassword");
        }
    }, [currentStep, resetField]);

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

    const handleFieldFocus = (fieldName: string) => {
        setFocusedFields(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleFieldBlur = (fieldName: string) => {
        setFocusedFields(prev => ({ ...prev, [fieldName]: false }));
    };

    const onSubmit = async (data: SignupFormValues) => {
        if (currentStep === 1) {
            const isValid = await trigger(['firstName', 'lastName', 'phoneNumber', 'country', 'city']);
            if (isValid) {
                setCurrentStep(2);
            }
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${API_URL}/auth/signup`, data);

            Toast.show({
                type: 'success',
                text1: 'Account Created!',
                text2: 'Verification link has been sent to your email.',
                visibilityTime: 4000,
            });
        } catch (error) {
            console.error("Error Signing up:", error);

            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error ?? "Sign-up failed. Please try again.";
                Toast.show({
                    type: 'error',
                    text1: 'Sign-up Failed',
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

    const renderInputField = (
        name: keyof SignupFormValues,
        placeholder: string,
        icon: string,
        keyboardType: any = "default",
        secureTextEntry: boolean = false
    ) => (
        <View className="mb-4">
            <View className={`relative bg-white/90 rounded-2xl border-2 ${
                focusedFields[name] ? 'border-yellow-400 shadow-lg' : 'border-transparent'
            } transition-all duration-200`}>
                <Ionicons
                    name={icon as any}
                    size={20}
                    color={focusedFields[name] ? "#f59e0b" : "#6b7280"}
                    style={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                />
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className="pl-12 pr-4 py-4 text-base text-gray-800 font-medium"
                            placeholder={placeholder}
                            placeholderTextColor="#9ca3af"
                            onChangeText={onChange}
                            value={value}
                            keyboardType={keyboardType}
                            secureTextEntry={secureTextEntry ? !showPassword : false}
                            autoCapitalize={name === 'email' || name === 'kcUsername' ? 'none' : 'words'}
                            // onFocus={() => handleFieldFocus(name)}
                            onBlur={() => {
                                onBlur();
                                handleFieldBlur(name);
                            }}
                        />
                    )}
                />
                {name === 'password' || name === 'confirmPassword' ? (
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
                ) : null}
            </View>
            {errors[name] && (
                <Text className="text-red-400 mt-2 ml-2 font-medium text-sm">
                    {errors[name]?.message}
                </Text>
            )}
        </View>
    );

    const renderPickerField = (
        name: keyof SignupFormValues,
        placeholder: string,
        options: string[],
        icon: string
    ) => (
        <View className="mb-4">
            <View className={`relative bg-white/90 rounded-2xl border-2 ${
                focusedFields[name] ? 'border-yellow-400 shadow-lg' : 'border-transparent'
            } transition-all duration-200`}>
                <Ionicons
                    name={icon as any}
                    size={20}
                    color={focusedFields[name] ? "#f59e0b" : "#6b7280"}
                    style={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                />
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value, onBlur } }) => (
                        <View className="pl-12 pr-4">
                            <Picker
                                selectedValue={value}
                                onValueChange={(itemValue) => {
                                    onChange(itemValue);
                                    // handleFieldFocus(name); // Simulate focus on value change
                                }}
                                onBlur={() => {
                                    onBlur();
                                    handleFieldBlur(name);
                                }}
                                style={{
                                    color: '#374151',
                                    fontWeight: '500',
                                    height: 56
                                }}
                            >
                                <Picker.Item label={placeholder} value="" color="#9ca3af" />
                                {options.map((option, idx) => (
                                    <Picker.Item key={idx} label={option} value={option} color="#374151" />
                                ))}
                            </Picker>
                        </View>
                    )}
                />
            </View>
            {errors[name] && (
                <Text className="text-red-400 mt-2 ml-2 font-medium text-sm">
                    {errors[name]?.message}
                </Text>
            )}
        </View>
    );

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
            <LinearGradient
                colors={['#1e1b4b', '#3730a3', '#4f46e5']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                >
                    <Animated.View
                        style={{
                            flex: 1,
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }}
                        className="px-6 py-8"
                    >
                        <View className="absolute top-10 right-0 w-32 h-32 bg-white/5 rounded-full" />
                        <View className="absolute bottom-40 left-0 w-24 h-24 bg-white/5 rounded-full" />

                        <Animated.View
                            style={{
                                transform: [{ scale: logoScale }],
                                alignItems: 'center',
                                marginBottom: 24
                            }}
                        >
                            <View className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl">
                                <Image
                                    source={require('@/assets/images/welcome/Logo-shadow.png')}
                                    className="w-[60px] h-[60px]"
                                    resizeMode="contain"
                                />
                            </View>
                        </Animated.View>

                        <View className="items-center mb-8">
                            <Text className="text-xl font-bold text-white mb-2 text-center">Welcome to Loveworld Foundation School!</Text>
                            <Text className="text-base text-white/70 text-center">Create your account to get started - Step {currentStep} of 2</Text>
                        </View>

                        <View className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                            <Text className="text-white font-bold text-lg mb-4 text-center">
                                {currentStep === 1 ? "Personal Information" : "Account Details"}
                            </Text>

                            {currentStep === 1 ? (
                                <>
                                    {renderInputField('firstName', 'First Name', 'person-outline')}
                                    {renderInputField('lastName', 'Last Name', 'person-outline')}
                                    {renderInputField('phoneNumber', 'Phone Number', 'call-outline', 'phone-pad')}
                                    {renderPickerField('country', 'Select your country', country, 'location-outline')}
                                    {renderInputField('city', 'City', 'location-outline')}
                                </>
                            ) : (
                                <>
                                    {renderPickerField('zone', 'Select your zone', zones, 'business-outline')}
                                    {renderInputField('church', 'Church', 'home-outline')}
                                    {renderInputField('email', 'Email Address', 'mail-outline', 'email-address')}
                                    {renderInputField('kcUsername', 'Kingschat ID', 'person-circle-outline', 'default')}
                                    {renderInputField('password', 'Password', 'lock-closed-outline', 'default', true)}
                                    {renderInputField('confirmPassword', 'Confirm Password', 'lock-closed-outline', 'default', true)}
                                </>
                            )}

                            <View className="flex-row space-x-3 mt-4">
                                {currentStep === 2 && (
                                    <Animated.View style={{ transform: [{ scale: buttonScale }], flex: 1 }}>
                                        <TouchableOpacity
                                            className="rounded-2xl py-4 items-center shadow-lg"
                                            onPress={() => setCurrentStep(1)}
                                            onPressIn={onButtonPressIn}
                                            onPressOut={onButtonPressOut}
                                            activeOpacity={0.9}
                                        >
                                            <LinearGradient
                                                colors={['#6b7280', '#4b5563']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={{
                                                    flex: 1,
                                                    width: '100%',
                                                    borderRadius: 16,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    paddingVertical: 16
                                                }}
                                            >
                                                <Text className="text-white font-bold text-lg">Back</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </Animated.View>
                                )}
                                <Animated.View style={{ transform: [{ scale: buttonScale }], flex: 1 }}>
                                    <TouchableOpacity
                                        className="rounded-2xl py-4 items-center shadow-lg"
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
                                                flex: 1,
                                                width: '100%',
                                                borderRadius: 16,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingVertical: 16
                                            }}
                                        >
                                            <Text className="text-white font-bold text-lg">
                                                {loading ? 'Creating Account...' : currentStep === 1 ? 'Next' : 'Create Account'}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </View>

                        <View className="items-center mt-6">
                            <TouchableOpacity
                                onPress={() => router.push('/signin')}
                                activeOpacity={0.7}
                                className="bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20"
                            >
                                <Text className="text-white font-semibold text-center">
                                    Already have an account? <Text className="text-yellow-300 font-bold">Sign In</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </LinearGradient>
            <Toast />
        </>
    );
};

export default SignupScreen;