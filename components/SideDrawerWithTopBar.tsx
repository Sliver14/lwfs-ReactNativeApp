import { useAuth } from "@/contexts/AuthContext";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useUser } from "../contexts/UserContext";

const screenWidth = Dimensions.get('window').width;

const SidebarWithTopMenu = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-screenWidth * 0.75)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { userDetails } = useUser();
    const { logout } = useAuth();
    const router = useRouter();
    const toggleSidebar = () => {
        if (isSidebarVisible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -screenWidth * 0.75,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => setSidebarVisible(false));
        } else {
            setSidebarVisible(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.7,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const handleOnlineClass = async () => {
        try {
            await WebBrowser.openBrowserAsync('https://online-school-olive.vercel.app/');
        } catch (error) {
            console.error('Error opening online class:', error);
        }
    };

    const menuItems = [
        { label: 'Home', icon: 'home-outline', link: '/' as const },
        { label: 'Online Class', icon: 'school-outline', action: handleOnlineClass },
        { label: 'Testimony', icon: 'chatbox-ellipses-outline', link: '/testimony/testimony' as const },
        { label: 'LiveTV', icon: 'tv-outline', link: '/livetv' as const },
        { label: 'About us', icon: 'information-circle-outline', link: '/home' as const },
        { label: 'Settings', icon: 'settings-outline', link: '/profile' as const },
    ];

    const CustomTouchable = ({ onPress, children }: any) => (
        <Pressable
            onPress={onPress}
            android_ripple={{ color: '#e5e5e5' }}
            style={({ pressed }) => [
                { backgroundColor: pressed ? '#f2f2f2' : 'transparent' },
            ]}
            className="flex-row items-center gap-3 px-3 py-3 rounded-xl"
        >
            {children}
        </Pressable>
    );

    return (
        <View className="flex-1 relative">
            {/* Top Bar — now rendered after but appears underneath due to z-index */}
            <View className="flex-row justify-between bg-white items-center pt-6 pb-4 px-8 z-10">
                <TouchableOpacity onPress={toggleSidebar}>
                    <Ionicons name="menu" size={32} color="black" />
                </TouchableOpacity>
                <Image
                    source={{ uri: 'https://res.cloudinary.com/dfi8bpolg/image/upload/v1736329279/samples/smile.jpg' }}
                    className="w-12 h-12 rounded-full"
                />
            </View>

            {/* Page Content */}
            <View className="flex-1">{children}</View>

            {/* Overlay */}
            {isSidebarVisible && (
                <Animated.View
                    className="absolute inset-0 bg-black"
                    style={{ opacity: fadeAnim }}
                >
                    <Pressable
                        style={{ flex: 1 }}
                        onPress={toggleSidebar}
                    />
                </Animated.View>
            )}

            {/* Sidebar */}
            <Animated.View
                className="absolute top-0 left-0 bg-white h-full z-50 pt-6 px-4 pb-10"
                style={{
                    width: screenWidth * 0.7,
                    transform: [{ translateX: slideAnim }],
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 5,
                }}
            >
                {/* Close button */}
                <TouchableOpacity onPress={toggleSidebar} className="mt-4 items-end">
                    <Ionicons name="close" size={28} color="black" />
                </TouchableOpacity>

                {/* Profile Info */}
                <View className="items-center mb-6">
                    <Image
                        source={{
                            uri: 'https://res.cloudinary.com/dfi8bpolg/image/upload/v1736329279/samples/smile.jpg',
                        }}
                        className="w-[70px] h-[70px] rounded-full mb-2"
                    />
                    <Text className="font-bold text-base">{userDetails?.lastName} {userDetails?.firstName}</Text>
                    <Text className="text-gray-500 text-sm">{userDetails?.email}</Text>
                </View>

                {/* Menu Items */}
                <View className="gap-2">
                    {menuItems.map((item, idx) => (
                        <CustomTouchable key={idx} onPress={() => {
                            if (item.action) {
                                item.action();
                            } else if (item.link) {
                                router.push(item.link as any);
                            }
                            toggleSidebar();
                        }}>
                            <Ionicons name={item.icon as any} size={20} color="#000" />
                            <Text className="text-[15px]">{item.label}</Text>
                        </CustomTouchable>
                    ))}

                    <CustomTouchable
                        onPress={async () => {
                            try {
                                await logout();
                                router.replace('/welcome');
                            } catch (error) {
                                console.error('Error during logout:', error);
                                Alert.alert('Error', 'Failed to sign out. Please try again.');
                            }
                        }}
                    >
                        <MaterialIcons name="logout" size={20} color="#000" />
                        <Text className="text-[15px]">Logout</Text>
                    </CustomTouchable>

                </View>
            </Animated.View>
        </View>
    );
};

export default SidebarWithTopMenu;
