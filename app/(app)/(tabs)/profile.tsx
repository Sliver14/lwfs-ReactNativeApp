import React, {useCallback} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, ImageBackground, Dimensions, StatusBar, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import bgWelcome from '../../../assets/images/welcome/bg-welcome-app.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useFocusEffect} from "expo-router";
import {useUser} from "../../../contexts/UserContext"
import {useRouter} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }: any) {
    const screenWidth = Dimensions.get('window').width;
    const {userDetails, logout} = useUser(); // Assuming logout function exists in context
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            StatusBar.setBackgroundColor('#6366F1');

            return () => {
                StatusBar.setBarStyle('dark-content');
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
                            // Remove token from storage
                            await SecureStore.deleteItemAsync('userToken');

                            // Redirect to welcome/login screen
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

        <ScrollView className="bg-gray-50 flex-1 mb-[75px]">
            {/* Header Section */}
            <LinearGradient
                colors={['#6366f1', '#9333ea']} // indigo-500 to purple-600
                start={{ x: 0, y: 0 }}          // top-left
                end={{ x: 1, y: 1 }}            // bottom-right (br = bottom-right)
                style={{ paddingBottom: 32 }}   // pb-8 = 32px padding
            >
                <SafeAreaView>
                    <View className="px-6 pt-4">
                        <Text className="font-bold text-2xl text-white mb-8">Profile</Text>

                        {/* Profile Card */}
                        <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <View className="items-center">
                                {/* Profile Avatar */}
                                <View className="relative mb-4">
                                    <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center border-4 border-white/30">
                                        <Ionicons name="person" size={40} color="white" />
                                    </View>
                                    <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white items-center justify-center">
                                        <View className="w-3 h-3 bg-white rounded-full" />
                                    </View>
                                </View>

                                {/* User Info */}
                                <Text className="text-white text-xl font-bold text-center">
                                    {userDetails?.firstName} {userDetails?.lastName}
                                </Text>
                                <Text className="text-white/80 text-sm text-center mt-1">
                                    {userDetails?.email}
                                </Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Menu Options */}
            <View className="flex-1 px-6 -mt-4">
                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Account Settings */}
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
                            label="Password & Security"
                            onPress={() => router.push('/SecurityScreen')}
                            showBorder={true}
                        />
                        <Option
                            icon="notifications-outline"
                            label="Notification Preferences"
                            showBorder={false}
                        />
                    </View>
                </View>

                {/* Store Section */}
                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
                    <View className="p-4">
                        <Text className="text-gray-500 font-semibold text-sm uppercase tracking-wide mb-3">
                            Store
                        </Text>

                        <Option
                            icon="bag-outline"
                            label="Order History"
                            showBorder={false}
                        />
                    </View>
                </View>

                {/* Logout Section */}
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