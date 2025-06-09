import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { API_URL } from '@/utils/env';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const { userDetails } = useUser();

    const validatePassword = (password) => {
        const validations = {
            length: password.length >= 4,
            hasLetter: /[a-zA-Z]/.test(password),
            hasNumber: /\d/.test(password),
        };
        return validations;
    };

    const handleReset = async () => {
        const newErrors = {};

        // Validate new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.length) {
            newErrors.newPassword = "Password must be at least 4 characters";
        }

        // Validate password match
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            setErrors({});

            await axios.post(`${API_URL}/auth/newpassword`, {
                email: userDetails?.email,
                password: newPassword,
            });

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                router.push("/(tabs)/index");
            }, 2500);
        } catch (error) {
            console.error(error);
            setErrors({ general: "Failed to reset password. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const passwordValidation = validatePassword(newPassword);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gradient-to-b from-blue-50 to-white"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                <View className="flex-1 px-6 pt-16 pb-8">
                    {/* Header Section */}
                    <View className="mb-8">
                        <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-6 self-center">
                            <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center">
                                <Text className="text-white font-bold text-lg">🔐</Text>
                            </View>
                        </View>

                        <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
                            Reset Password
                        </Text>
                        <Text className="text-gray-600 text-center text-base leading-6">
                            Create a new secure password for your account
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View className="space-y-6 gap-8">
                        {/* General Error */}
                        {errors.general && (
                            <View className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <Text className="text-red-600 text-center">{errors.general}</Text>
                            </View>
                        )}

                        {/* New Password Field */}
                        <View>
                            <Text className="text-gray-700 font-semibold mb-2">New Password</Text>
                            <View className="relative">
                                <TextInput
                                    value={newPassword}
                                    onChangeText={(text) => {
                                        setNewPassword(text);
                                        if (errors.newPassword) {
                                            setErrors(prev => ({ ...prev, newPassword: null }));
                                        }
                                    }}
                                    secureTextEntry={!showNewPassword}
                                    placeholder="Enter your new password"
                                    className={`border-2 rounded-xl p-4 pr-12 text-base ${
                                        errors.newPassword
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-200 bg-white focus:border-orange-400'
                                    }`}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-2"
                                >
                                    <Text className="text-2xl">{showNewPassword ? '👁️' : '👁️‍🗨️'}</Text>
                                </TouchableOpacity>
                            </View>

                            {errors.newPassword && (
                                <Text className="text-red-500 text-sm mt-1">{errors.newPassword}</Text>
                            )}

                            {/* Password Strength Indicator */}
                            {newPassword.length > 0 && (
                                <View className="mt-3 space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Password Requirements:</Text>
                                    <View className="space-y-1">
                                        <View className="flex-row items-center space-x-2">
                                            <View className={`w-4 h-4 rounded-full ${passwordValidation.length ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                {passwordValidation.length && <Text className="text-white text-xs text-center">✓</Text>}
                                            </View>
                                            <Text className={`text-sm ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                                                At least 4 characters
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Confirm Password Field */}
                        <View>
                            <Text className="text-gray-700 font-semibold mb-2">Confirm Password</Text>
                            <View className="relative">
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        if (errors.confirmPassword) {
                                            setErrors(prev => ({ ...prev, confirmPassword: null }));
                                        }
                                    }}
                                    secureTextEntry={!showConfirmPassword}
                                    placeholder="Confirm your new password"
                                    className={`border-2 rounded-xl p-4 pr-12 text-base ${
                                        errors.confirmPassword
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-200 bg-white focus:border-orange-400'
                                    }`}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-2"
                                >
                                    <Text className="text-2xl">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                                </TouchableOpacity>
                            </View>

                            {errors.confirmPassword && (
                                <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
                            )}

                            {/* Password Match Indicator */}
                            {confirmPassword.length > 0 && (
                                <View className="flex-row items-center space-x-2 mt-2">
                                    <View className={`w-4 h-4 rounded-full ${
                                        newPassword === confirmPassword && confirmPassword.length > 0
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                    }`}>
                                        <Text className="text-white text-xs text-center">
                                            {newPassword === confirmPassword && confirmPassword.length > 0 ? '✓' : '✗'}
                                        </Text>
                                    </View>
                                    <Text className={`text-sm ${
                                        newPassword === confirmPassword && confirmPassword.length > 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                        {newPassword === confirmPassword && confirmPassword.length > 0
                                            ? 'Passwords match'
                                            : 'Passwords do not match'
                                        }
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Reset Button */}
                        <TouchableOpacity
                            onPress={handleReset}
                            disabled={loading || !newPassword || !confirmPassword}
                            className={`rounded-xl py-4 px-6 shadow-lg ${
                                loading || !newPassword || !confirmPassword
                                    ? 'bg-gray-500'
                                    : 'bg-gradient-to-r from-gray-900 to-gray-800 shadow-gray-200'
                            }`}
                            style={{
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                            }}
                        >
                            {loading ? (
                                <View className="flex-row items-center justify-center space-x-2">
                                    <ActivityIndicator color="#fff" size="small" />
                                    <Text className="text-white font-bold text-lg">Updating...</Text>
                                </View>
                            ) : (
                                <Text className="text-center text-white font-bold text-lg">
                                    Reset Password
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Success Modal */}
            <Modal transparent={true} visible={showSuccessModal} animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <View className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mx-auto mb-4">
                                <Text className="text-3xl">✅</Text>
                            </View>
                            <Text className="text-2xl font-bold text-white text-center">
                                Success!
                            </Text>
                        </View>

                        <View className="p-6">
                            <Text className="text-gray-700 text-center text-lg mb-4 leading-6">
                                Your password has been successfully reset.
                            </Text>

                            <View className="flex-row items-center justify-center space-x-2">
                                <ActivityIndicator size="small" color="#10B981" />
                                <Text className="text-green-600 font-medium">
                                    Redirecting to home...
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}