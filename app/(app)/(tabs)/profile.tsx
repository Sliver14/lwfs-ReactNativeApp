import { API_URL } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, ScrollView, StatusBar, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from "../../../contexts/UserContext";

export default function ProfileScreen({ navigation }: any) {
    const screenWidth = Dimensions.get('window').width;
    const { userDetails, logout } = useUser();
    const router = useRouter();
    const email = userDetails?.email;

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (newPassword.length < 4) {
            Alert.alert("Error", "Password must be at least 4 characters long");
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${API_URL}/auth/newpassword`, {
                email: email,
                password: newPassword,
            });

            Alert.alert(
                "Success",
                "Password changed successfully",
                [{ text: "OK", onPress: () => setModalVisible(false) }]
            );
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error",
                "Failed to change password. Please try again.",
                [{ text: "OK", style: "default" }]
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            StatusBar.setBackgroundColor('#453ace');

            return () => {
                StatusBar.setBarStyle('light-content');
                StatusBar.setBackgroundColor('#ffffff');
            };
        }, [])
    );

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await SecureStore.deleteItemAsync('userToken');
                            router.replace('/welcome');
                        } catch (error) {
                            console.log('Logout error:', error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 mb-[75px]">
                <View className="flex bg-[#453ace]">
                    <SafeAreaView>
                        <View className="px-6 pt-4">
                            <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <View className="items-center">
                                    <View className="relative mb-4">
                                        <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center border-4 border-white/30">
                                            <Ionicons name="person" size={40} color="white" />
                                        </View>
                                        <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white items-center justify-center">
                                            <View className="w-3 h-3 bg-white rounded-full" />
                                        </View>
                                    </View>
                                    <Text className="text-white text-xl font-bold text-center">
                                        {userDetails?.firstName
                                            ? userDetails.firstName.charAt(0).toUpperCase() + userDetails.firstName.slice(1)
                                            : ''}{' '}
                                        {userDetails?.lastName
                                            ? userDetails.lastName.charAt(0).toUpperCase() + userDetails.lastName.slice(1)
                                            : ''}
                                    </Text>
                                    <Text className="text-white/80 text-sm text-center mt-1">
                                        {userDetails?.email}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>

                <View className="flex-1 px-6 -mt-4">
                    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <View className="p-4">
                            <Text className="text-gray-500 font-semibold text-sm uppercase tracking-wide mb-3">
                                Account Settings
                            </Text>
                            <Option
                                icon="person-outline"
                                label="Personal Information"
                                onPress={() => router.push('/PersonalInfoScreen')}
                                showBorder={true}
                            />
                            <Option
                                icon="lock-closed-outline"
                                label="Change Password"
                                onPress={() => setModalVisible(true)}
                                showBorder={true}
                            />
                            <Option
                                icon="notifications-outline"
                                label="Notification Preferences"
                                showBorder={false}
                            />
                        </View>
                    </View>

                    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
                        <View className="p-4">
                            <Text className="text-gray-500 font-semibold text-sm uppercase tracking-wide mb-3">
                                Store
                            </Text>
                            <Option
                                icon="bag-outline"
                                label="Order History"
                                onPress={() => router.push('/OrderHistory')}
                                showBorder={false}
                            />
                        </View>
                    </View>

                    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4 mb-6">
                        <TouchableOpacity
                            className="p-4 flex-row items-center justify-between"
                            onPress={handleLogout}
                        >
                            <View className="flex-row items-center space-x-3">
                                <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center">
                                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                                </View>
                                <Text className="text-red-500 font-medium">Logout</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-2xl p-6 w-[90%]">
                        <Text className="text-xl font-bold mb-4">Change Password</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-3 mb-4"
                            placeholder="New Password"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TextInput
                            className="border border-gray-300 rounded-lg p-3 mb-4"
                            placeholder="Confirm New Password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <View className="flex-row gap-5 justify-end space-x-3">
                            <TouchableOpacity
                                className="bg-gray-200 rounded-lg px-4 py-2"
                                onPress={() => {
                                    setModalVisible(false);
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                            >
                                <Text className="text-gray-800 font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-[#453ace] rounded-lg px-4 py-2"
                                onPress={handleChangePassword}
                                disabled={loading}
                            >
                                <Text className="text-white font-medium">
                                    {loading ? 'Changing...' : 'Change Password'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const Option = ({
                    icon,
                    label,
                    onPress,
                    showBorder = true,
                }: {
    icon: string;
    label: string;
    onPress?: () => void;
    showBorder?: boolean;
}) => {
    return (
        <TouchableOpacity
            className={`py-4 flex-row items-center justify-between ${
                showBorder ? 'border-b border-gray-100' : ''
            }`}
            onPress={onPress}
        >
            <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
                    <Ionicons name={icon as any} size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-800 font-medium">{label}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>
    );
};