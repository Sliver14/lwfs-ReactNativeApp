import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/utils/env';

export default function SecurityScreen() {
    const router = useRouter();
    const { userDetails } = useUser();
    const email = userDetails?.email;
    const [loading, setLoading] = useState(false);

    const SendOtp = async () => {
        if (!email) {
            Alert.alert("Error", "Email not available", [
                { text: "OK", style: "default" }
            ]);
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${API_URL}/auth/resetresend`, {
                email: email,
            });

            Alert.alert(
                "OTP Sent",
                "Please check your email for the verification code.",
                [{ text: "Continue", onPress: () => router.push('/Verification') }]
            );
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error",
                "Failed to send OTP. Please check your connection and try again.",
                [{ text: "OK", style: "default" }]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBackPress = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
                <TouchableOpacity
                    onPress={handleBackPress}
                    className="mr-3 p-2 -ml-2"
                >
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 flex-1">
                    Security & Privacy
                </Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                {/* Account Security Section */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                        Account Security
                    </Text>
                    <Text className="text-sm text-gray-500 mb-4">
                        Manage your password and account verification
                    </Text>

                    <View className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <SecurityOption
                            icon="lock-closed"
                            label="Change Password"
                            subtext="Last updated 30 days ago"
                            onPress={SendOtp}
                            loading={loading}
                            showChevron={true}
                            borderBottom={true}
                        />
                        <SecurityOption
                            icon="mail"
                            label="Email Verification"
                            subtext={email ? `${email} • Verified` : "Not Registered"}
                            status={email ? "verified" : "unverified"}
                            showChevron={false}
                        />
                    </View>
                </View>

                {/* Privacy Settings Section */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                        Privacy Settings
                    </Text>
                    <Text className="text-sm text-gray-500 mb-4">
                        Control how your information is used
                    </Text>

                    <View className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <SecurityOption
                            icon="eye-off"
                            label="Privacy Policy"
                            subtext="Review our privacy practices"
                            showChevron={true}
                            borderBottom={true}
                        />
                        <SecurityOption
                            icon="shield-checkmark"
                            label="Data & Security"
                            subtext="Manage your data preferences"
                            showChevron={true}
                        />
                    </View>
                </View>

                {/* Additional Options */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                        Additional Options
                    </Text>
                    <Text className="text-sm text-gray-500 mb-4">
                        More security and account options
                    </Text>

                    <View className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <SecurityOption
                            icon="log-out"
                            label="Sign Out"
                            subtext="Sign out of your account"
                            showChevron={true}
                            borderBottom={true}
                            textColor="text-red-600"
                        />
                        <SecurityOption
                            icon="trash"
                            label="Delete Account"
                            subtext="Permanently delete your account"
                            showChevron={true}
                            textColor="text-red-600"
                        />
                    </View>
                </View>

                {/* Security Tips */}
                <View className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="information-circle" size={20} color="#3b82f6" />
                        <Text className="text-blue-800 font-medium ml-2">Security Tip</Text>
                    </View>
                    <Text className="text-blue-700 text-sm leading-5">
                        Keep your account secure by using a strong password and enabling email verification.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const SecurityOption = ({
                            icon,
                            label,
                            subtext,
                            onPress,
                            loading = false,
                            showChevron = false,
                            borderBottom = false,
                            status = null,
                            textColor = "text-gray-900"
                        }) => (
    <TouchableOpacity
        className={`p-4 flex-row items-center justify-between ${
            borderBottom ? 'border-b border-gray-100' : ''
        }`}
        onPress={loading ? null : onPress}
        disabled={loading || !onPress}
        activeOpacity={onPress ? 0.7 : 1}
    >
        <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Ionicons
                    name={icon}
                    size={20}
                    color={textColor.includes('red') ? '#dc2626' : '#6b7280'}
                />
            </View>

            <View className="flex-1">
                <Text className={`font-medium ${textColor} text-base`}>
                    {label}
                </Text>
                <View className="flex-row items-center mt-1">
                    <Text className="text-gray-500 text-sm flex-1">
                        {subtext}
                    </Text>
                    {status === 'verified' && (
                        <View className="bg-green-100 px-2 py-1 rounded-full ml-2">
                            <Text className="text-green-800 text-xs font-medium">
                                Verified
                            </Text>
                        </View>
                    )}
                    {status === 'unverified' && (
                        <View className="bg-orange-100 px-2 py-1 rounded-full ml-2">
                            <Text className="text-orange-800 text-xs font-medium">
                                Unverified
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>

        <View className="flex-row items-center">
            {loading && (
                <ActivityIndicator
                    size="small"
                    color="#6b7280"
                    className="mr-2"
                />
            )}
            {showChevron && !loading && (
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            )}
        </View>
    </TouchableOpacity>
);