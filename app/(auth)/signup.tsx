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

const { width, height } = Dimensions.get('window');

interface SignupFormValues {
    firstName: string;
    lastName: string;
    countryCode: string;
    phoneNumber: string;
    zone: string;
    country: string;
    church: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const validationSchema = Yup.object({
    firstName: Yup.string()
        .trim()
        .matches(/^[A-Za-z\s]+$/, "First Name must contain only letters")
        .required("First Name is required"),
    lastName: Yup.string()
        .trim()
        .matches(/^[A-Za-z\s]+$/, "Last Name must contain only letters")
        .required("Last Name is required"),
    countryCode: Yup.string().required("Country Code is required"),
    phoneNumber: Yup.string()
        .max(15, "Phone number must not exceed 15 digits")
        .matches(/^\d+$/, "Phone number must contain only numbers")
        .required("Phone number is required"),
    zone: Yup.string().required("Zone is required"),
    country: Yup.string().required("Country is required"),
    church: Yup.string().required("Church is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(4, "Password must be at least 4 characters").required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

const SignupScreen = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const errorShake = useRef(new Animated.Value(0)).current;

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            countryCode: "+234",
            phoneNumber: "",
            zone: "",
            country: "Nigeria",
            church: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

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

        const subscription = watch((value) => {
            if (value.email) {
                // Save to local storage if needed
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

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

    const handleFieldFocus = (fieldName: string) => {
        setFocusedFields(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleFieldBlur = (fieldName: string) => {
        setFocusedFields(prev => ({ ...prev, [fieldName]: false }));
    };

    // const onSubmit = async (data: SignupFormValues) => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         // Your API call here
    //         console.log("Form data", data);
    //         // router.push("/signup/verify");
    //     } catch (e) {
    //         setError("Signup failed. Please try again.");
    //         shakeError();
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const onSubmit = async (data: SignupFormValues) => {
        setLoading(true);
        setError(null);
        // setSuccess(null);

        // Save email to AsyncStorage for verification or future use
        await AsyncStorage.setItem('email', data.email);

        try {
            await axios.post(`${API_URL}/auth/signup`, data);
            router.push("/(auth)/SignupVerification");


            // setSuccess(response.data.message);

        } catch(error){
            // console.error("Error Signing up", error);

            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error ?? "Sign-up failed";

                if (errorMessage.includes("User not verified")) {
                    try{
                        await axios.post(`${API_URL}/auth/resendcode`, {email: data.email});
                        // setSuccess(response.data.message || "Resend Succeessful")
                        setError("User not verified. Redirecting to verification...");
                        setTimeout(() => router.push("/(auth)/SignupVerification"), 2000);
                    }catch(error){
                        if (axios.isAxiosError(error)) {
                            setError(error.response?.data?.error || "Resend failed");
                        } else {
                            setError("An unknown error occurred.");
                        }
                    }
                    // setError("User not verified. Redirecting to verification...");
                    // setTimeout(() => router.push("/(auth)/SignupVerification"), 2000);
                } else {
                    setError(errorMessage);
                }
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }
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
                            secureTextEntry={secureTextEntry}
                            autoCapitalize={name === 'email' ? 'none' : 'words'}
                            // onFocus={() => handleFieldFocus(name)}
                            // onBlur={() => {
                            //     onBlur();
                            //     handleFieldBlur(name);
                            // }}
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
                <Animated.Text
                    style={{ transform: [{ translateX: errorShake }] }}
                    className="text-yellow-300 mt-2 ml-2 font-medium text-sm"
                >
                    {errors[name]?.message}
                </Animated.Text>
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
                    render={({ field: { onChange, value } }) => (
                        <View className="pl-12 pr-4">
                            <Picker
                                selectedValue={value}
                                onValueChange={(itemValue) => onChange(itemValue)}
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
                <Animated.Text
                    style={{ transform: [{ translateX: errorShake }] }}
                    className="text-yellow-300 mt-2 ml-2 font-medium text-sm"
                >
                    {errors[name]?.message}
                </Animated.Text>
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
                        {/* Background Decorative Elements */}
                        <View className="absolute top-10 right-0 w-32 h-32 bg-white/5 rounded-full" />
                        <View className="absolute bottom-40 left-0 w-24 h-24 bg-white/5 rounded-full" />

                        {/* Logo with Animation */}
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

                        {/* Welcome Text */}
                        <View className="items-center mb-8">
                            <Text className="text-xl font-bold text-white mb-2 text-center">Welcome to Loveworld Foundation School!</Text>
                            <Text className="text-base text-white/70 text-center">Create your account to get started</Text>
                        </View>

                        {/* Form Container */}
                        <View className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                            {/* Personal Information */}
                            <Text className="text-white font-bold text-lg mb-4 text-center">Personal Information</Text>

                            {renderInputField('firstName', 'First Name', 'person-outline')}
                            {renderInputField('lastName', 'Last Name', 'person-outline')}

                            {/* Country Picker */}
                            {renderPickerField('country', 'Select your country', country, 'location-outline')}

                            {renderInputField('phoneNumber', 'Phone Number', 'call-outline', 'phone-pad')}

                            {/* Zone Picker */}
                            {renderPickerField('zone', 'Select your zone', zones, 'business-outline')}

                            {renderInputField('church', 'Church', 'home-outline')}

                            {/* Account Information */}
                            {/*<Text className="text-white font-bold text-lg mb-4 mt-6 text-center">Account Information</Text>*/}

                            {renderInputField('email', 'Email Address', 'mail-outline', 'email-address')}
                            {renderInputField('password', 'Password', 'lock-closed-outline', 'default', !showPassword)}
                            {renderInputField('confirmPassword', 'Confirm Password', 'lock-closed-outline', 'default', !showPassword)}

                            {/* Error Message */}
                            {error && (
                                <Animated.View
                                    style={{ transform: [{ translateX: errorShake }] }}
                                    className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 mb-6"
                                >
                                    <Text className="text-red-300 text-center font-medium">{error}</Text>
                                </Animated.View>
                            )}

                            {/* Submit Button */}
                            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                <TouchableOpacity
                                    className="rounded-2xl py-4 items-center shadow-lg mt-4"
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
                                            {loading ? 'Creating Account...' : 'Create Account'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>

                        {/* Sign In Link */}
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
        </>
    );
};

export default SignupScreen;