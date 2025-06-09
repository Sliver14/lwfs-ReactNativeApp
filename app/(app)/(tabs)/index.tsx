import {View, Text, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import EventCarousal from "../../../components/EventCarousal";
import React from "react";
import {SafeAreaView} from "react-native";
import HomeHeader from "@/components/HomeHeader";
import DevotionCard from "@/components/DevotionCard";
import { useUser } from '../../../contexts/UserContext';
// import SidebarWithTopMenu from "@/components/SideDrawerWithTopBar";

export default function Index() {
    const router = useRouter();
    const { userDetails } = useUser();

    return (
        <SafeAreaView className="flex-1 mb-[75px] bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
            {/*<SidebarWithTopMenu>*/}
                <ScrollView className="flex-1 w-screen bg-gradient-to-b  from-slate-50 to-white">
                    {/* Hero Section with Welcome Message */}
                    <HomeHeader name={userDetails?.firstName}/>
                    <DevotionCard/>

                    {/* Main Feature Grid */}
                    <View className="px-4 mt-6">
                        <Text className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'System' }}>
                            Quick Actions
                        </Text>

                        <View className="flex-row flex-wrap justify-between">
                            {/*<TouchableOpacity*/}
                            {/*    className="bg-white border border-blue-100 p-6 rounded-2xl w-[48%] mb-4 shadow-md"*/}
                            {/*    onPress={() => router.push('/getStarted/signin')}*/}
                            {/*    style={{*/}
                            {/*        shadowColor: '#3b82f6',*/}
                            {/*        shadowOffset: { width: 0, height: 4 },*/}
                            {/*        shadowOpacity: 0.1,*/}
                            {/*        shadowRadius: 8*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <View className="bg-blue-500 w-12 h-12 rounded-xl items-center justify-center mb-3">*/}
                            {/*        <MaterialIcons name="school" size={24} color="#fff" />*/}
                            {/*    </View>*/}
                            {/*    <Text className="text-gray-800 font-semibold text-base mb-1" style={{ fontFamily: 'System' }}>*/}
                            {/*        Online Classes*/}
                            {/*    </Text>*/}
                            {/*    <Text className="text-gray-500 text-sm" style={{ fontFamily: 'System' }}>*/}
                            {/*        Join interactive lessons*/}
                            {/*    </Text>*/}
                            {/*</TouchableOpacity>*/}
                        
                            <TouchableOpacity
                                className="bg-white border border-purple-100 p-6 rounded-2xl w-[48%] mb-4 shadow-md"
                                onPress={() => router.push('/livetv')}
                                style={{
                                    shadowColor: '#8b5cf6',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8
                                }}
                            >
                                <View className="bg-purple-500 w-12 h-12 rounded-xl items-center justify-center mb-3">
                                    <MaterialIcons name="tv" size={24} color="#fff" />
                                </View>
                                <Text className="text-gray-800 font-semibold text-base mb-1" style={{ fontFamily: 'System' }}>
                                    Live TV
                                </Text>
                                <Text className="text-gray-500 text-sm" style={{ fontFamily: 'System' }}>
                                    Watch services live
                                </Text>
                            </TouchableOpacity>
                        
                            {/*<TouchableOpacity*/}
                            {/*    className="bg-white border border-green-100 p-6 rounded-2xl w-[48%] mb-4 shadow-md"*/}
                            {/*    onPress={() => router.push('/getStarted/signup')}*/}
                            {/*    style={{*/}
                            {/*        shadowColor: '#10b981',*/}
                            {/*        shadowOffset: { width: 0, height: 4 },*/}
                            {/*        shadowOpacity: 0.1,*/}
                            {/*        shadowRadius: 8*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <View className="bg-green-500 w-12 h-12 rounded-xl items-center justify-center mb-3">*/}
                            {/*        <MaterialIcons name="record-voice-over" size={24} color="#fff" />*/}
                            {/*    </View>*/}
                            {/*    <Text className="text-gray-800 font-semibold text-base mb-1" style={{ fontFamily: 'System' }}>*/}
                            {/*        Testimonies*/}
                            {/*    </Text>*/}
                            {/*    <Text className="text-gray-500 text-sm" style={{ fontFamily: 'System' }}>*/}
                            {/*        Listen to Inspiring Testimonies*/}
                            {/*    </Text>*/}
                            {/*</TouchableOpacity>*/}
                        
                            <TouchableOpacity
                                className="bg-white border bg-gray-400 border-orange-100 p-6 rounded-2xl w-[48%] mb-4 shadow-md"
                                onPress={() => router.push('/store')}
                                style={{
                                    shadowColor: '#f97316',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8
                                }}
                            >
                                <View className="bg-orange-500 w-12 h-12 rounded-xl items-center justify-center mb-3">
                                    <MaterialIcons name="storefront" size={24} color="#fff" />
                                </View>
                                <Text className="text-gray-800 font-semibold text-base mb-1" style={{ fontFamily: 'System' }}>
                                    Store
                                </Text>
                                <Text className="text-gray-500 text-sm" style={{ fontFamily: 'System' }}>
                                    Browse resources
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                     {/*Event Carousel*/}
                        <EventCarousal />
                </ScrollView>
            {/*</SidebarWithTopMenu>*/}
        </SafeAreaView>
    );
}