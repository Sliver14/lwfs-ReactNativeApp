import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";
import OTPInputs from "@/components/OTPInput";
import { API_URL } from '@/utils/env';


export default function Verification() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const router = useRouter();
    const { userDetails } = useUser();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const handleContinue = async () => {
        // Option 2: Store email in state on component mount (Recommended)

        if (code.length !== 6) {
            Alert.alert("Error", "Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${API_URL}/auth/signup/verify`, {
                code,
                email: userEmail?.email,
            });

            setSuccessModalVisible(true);
            setTimeout(() => {
                setSuccessModalVisible(false);
                router.push("/(auth)/ResetPassword");
            }, 2500);
        } catch (error) {
            console.error(error);
            Alert.alert("Verification Failed", "The OTP entered is incorrect or expired.");
        } finally {
            setLoading(false);
            setCode("");
        }
    };

    const resendCode = async () => {
        try {
            setLoading(true);
            await axios.post(`${API_URL}/auth/resendcode`, {
                email: userDetails?.email,
            });
            Alert.alert("OTP Sent", "A new code has been sent to your email.");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to resend OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white p-6 justify-center">
            <Text className="text-xl font-bold mb-4">Verification</Text>
            <Text className="text-gray-500 mb-4">
                We sent you a code to verify your email.
            </Text>

            <OTPInputs code={code} setCode={setCode} />

            <TouchableOpacity
                onPress={handleContinue}
                disabled={loading}
                className={`rounded-lg py-4 ${loading ? "bg-gray-400" : "bg-slate-600"}`}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-center text-white font-bold text-lg">
                        Continue
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={resendCode} className="mt-4">
                <Text className="text-center text-gray-500">
                    Didn't receive a code?{" "}
                    <Text className="text-slate-600 font-bold">RESEND</Text>
                </Text>
            </TouchableOpacity>

            {/* ✅ Success Modal */}
            <Modal transparent visible={successModalVisible} animationType="fade">
                <View className="flex-1 bg-black/60 justify-center items-center px-8">
                    <View className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm items-center">
                        {/* Success Icon */}
                        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                            <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                                <Text className="text-white font-bold text-lg">✓</Text>
                            </View>
                        </View>

                        <Text className="text-2xl font-bold text-gray-800 mb-3">Verified!</Text>
                        <Text className="text-gray-500 text-center text-base leading-relaxed mb-4">
                            Your email has been successfully verified. You'll be redirected shortly.
                        </Text>

                        {/* Loading indicator */}
                        <View className="flex-row items-center">
                            <ActivityIndicator size="small" color="#10b981" />
                            <Text className="text-green-600 font-medium ml-2">Redirecting...</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}