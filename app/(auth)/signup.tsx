import SearchablePicker from '@/components/shared/SearchablePicker';
import { API_URL } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Toast from 'react-native-toast-message';
import * as Yup from "yup";
import country from "../../utils/country";
import zones from "../../utils/zones";

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
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showZonePicker, setShowZonePicker] = useState(false);

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
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={{ marginBottom: 16 }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (name === 'country') {
                                setShowCountryPicker(true);
                            } else if (name === 'zone') {
                                setShowZonePicker(true);
                            }
                        }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            borderWidth: 1,
                            borderColor: error ? '#ef4444' : focusedFields[name] ? '#facc15' : 'rgba(255,255,255,0.2)'
                        }}
                    >
                        <Ionicons name={icon as any} size={20} color={error ? '#ef4444' : '#fff'} style={{ marginRight: 12 }} />
                        <Text style={{ 
                            flex: 1,
                            color: value ? '#fff' : 'rgba(255,255,255,0.5)',
                            fontSize: 16
                        }}>
                            {value || placeholder}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#fff" />
                    </TouchableOpacity>
                    {error && (
                        <Text style={{ color: '#ef4444', marginTop: 8, marginLeft: 8 }}>
                            {error.message}
                        </Text>
                    )}

                    {name === 'country' && (
                        <SearchablePicker
                            isVisible={showCountryPicker}
                            onClose={() => setShowCountryPicker(false)}
                            onSelect={onChange}
                            items={country}
                            selectedValue={value}
                            title="Select Country"
                            placeholder="Search countries..."
                        />
                    )}

                    {name === 'zone' && (
                        <SearchablePicker
                            isVisible={showZonePicker}
                            onClose={() => setShowZonePicker(false)}
                            onSelect={onChange}
                            items={zones}
                            selectedValue={value}
                            title="Select Zone"
                            placeholder="Search zones..."
                        />
                    )}
                </View>
            )}
        />
    );

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#000' }}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
            >
                <LinearGradient
                    colors={['#1e1b4b', '#3730a3', '#4f46e5']}
                    style={{ flex: 1 }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <ScrollView 
                        contentContainerStyle={{ 
                            flexGrow: 1,
                            paddingBottom: 40
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Animated.View
                            style={{
                                flex: 1,
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                                paddingHorizontal: 24,
                                paddingTop: height * 0.05,
                                paddingBottom: 24,
                                minHeight: height,
                                justifyContent: 'space-between'
                            }}
                        >
                            <View>
                                {/* Logo Section */}
                                <Animated.View
                                    style={{
                                        alignItems: 'center',
                                        marginBottom: 32,
                                        transform: [{ scale: logoScale }],
                                    }}
                                >
                                    <Image
                                        source={require('../../assets/images/welcome/Logo-shadow.png')}
                                        style={{ width: 100, height: 100, resizeMode: 'contain' }}
                                    />
                                    <View style={{ alignItems: 'center', marginTop: 16 }}>
                                        <Text style={{ color: '#facc15', fontSize: 18, fontWeight: '600' }}>
                                            LOVEWORLD
                                        </Text>
                                        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
                                            FOUNDATION SCHOOL
                                        </Text>
                                    </View>
                                </Animated.View>

                                {/* Progress Indicator */}
                                <View style={{ 
                                    flexDirection: 'row', 
                                    justifyContent: 'center', 
                                    marginBottom: 24,
                                    paddingHorizontal: 16 
                                }}>
                                    <View style={{ 
                                        flex: 1,
                                        height: 4,
                                        backgroundColor: currentStep === 1 ? '#facc15' : '#fff',
                                        borderRadius: 2,
                                        marginRight: 8
                                    }} />
                                    <View style={{ 
                                        flex: 1,
                                        height: 4,
                                        backgroundColor: currentStep === 2 ? '#facc15' : '#fff',
                                        borderRadius: 2,
                                        marginLeft: 8
                                    }} />
                                </View>

                                {/* Form Section */}
                                <View>
                                    {currentStep === 1 ? (
                                        <>
                                            {renderInputField("firstName", "First Name", "person-outline")}
                                            {renderInputField("lastName", "Last Name", "person-outline")}
                                            {renderInputField("phoneNumber", "Phone Number", "call-outline", "numeric")}
                                            {renderPickerField("country", "Select Country", country, "globe-outline")}
                                            {renderInputField("city", "City", "location-outline")}
                                        </>
                                    ) : (
                                        <>
                                            {renderPickerField("zone", "Select Zone", zones, "map-outline")}
                                            {renderInputField("church", "Church", "business-outline")}
                                            {renderInputField("email", "Email", "mail-outline", "email-address")}
                                            {renderInputField("kcUsername", "Kingschat ID", "person-circle-outline")}
                                            {renderInputField("password", "Password", "lock-closed-outline", "default", true)}
                                            {renderInputField("confirmPassword", "Confirm Password", "lock-closed-outline", "default", true)}
                                        </>
                                    )}
                                </View>
                            </View>

                            {/* Buttons Section - Now in a separate View at the bottom */}
                            <View style={{ marginTop: 16 }}>
                                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                    <TouchableOpacity
                                        onPress={handleSubmit(onSubmit)}
                                        onPressIn={onButtonPressIn}
                                        onPressOut={onButtonPressOut}
                                        disabled={loading}
                                        style={{
                                            backgroundColor: '#facc15',
                                            paddingVertical: 16,
                                            borderRadius: 12,
                                            alignItems: 'center',
                                            opacity: loading ? 0.7 : 1,
                                        }}
                                    >
                                        <Text style={{ color: '#1e1b4b', fontSize: 16, fontWeight: 'bold' }}>
                                            {currentStep === 1 ? 'Next' : (loading ? 'Creating Account...' : 'Create Account')}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>

                                {currentStep === 2 && (
                                    <TouchableOpacity
                                        onPress={() => setCurrentStep(1)}
                                        style={{
                                            marginTop: 16,
                                            paddingVertical: 12,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 16 }}>
                                            Back to Step 1
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <View style={{ 
                                    marginTop: 24,
                                    marginBottom: 16,
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity
                                        onPress={() => router.push('/signin')}
                                        style={{ 
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            paddingVertical: 12,
                                            paddingHorizontal: 20,
                                            borderRadius: 20
                                        }}
                                    >
                                        <Text style={{ color: '#fff', marginRight: 4 }}>
                                            Already have an account?
                                        </Text>
                                        <Text style={{ color: '#facc15', fontWeight: 'bold' }}>
                                            Sign In
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </LinearGradient>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaView>
    );
};

export default SignupScreen;