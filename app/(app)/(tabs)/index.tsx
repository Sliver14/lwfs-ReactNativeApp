import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import VideoPlayer from "../../components/videoplayer";
import EventCarousal from "../../components/EventCarousal";
import SidebarWithTopMenu from "@/components/SideDrawerWithTopBar";

export default function Index() {
    const router = useRouter();

    return (
        <>
            <SidebarWithTopMenu>
            <ScrollView className="flex-1 bg-white">
                {/* Colorful Banner */}
                {/*<LinearGradient*/}
                {/*    colors={['#7c3aed', '#3b82f6']} // purple-600 to blue-500*/}
                {/*    start={{ x: 0, y: 0 }}*/}
                {/*    end={{ x: 1, y: 0 }}*/}
                {/*    className="p-5 rounded-xl mb-6 shadow-lg"*/}
                {/*>*/}
                {/*    <Text className="text-white text-xl font-bold mb-2">Upcoming Event</Text>*/}
                {/*    <Text className="text-white">All Praise Service with Pastor Chris </Text>*/}
                {/*</LinearGradient>*/}
                <EventCarousal/>

                {/* Feature Buttons */}
                <View className="flex-row px-4 flex-wrap justify-between mb-0">
                    <TouchableOpacity
                        className="bg-primary p-4 rounded-lg w-[48%] mb-3 items-center"
                        onPress={() => router.push('/getStarted/signin')}
                    >
                        <MaterialIcons name="school" size={24} color="#fff" />
                        <Text className="text-center text-white mt-2 text-sm">Online Class</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-primary p-4 rounded-lg w-[48%] mb-3 items-center"
                        onPress={() => router.push('/getStarted/welcome')}
                    >
                        <MaterialIcons name="tv" size={24} color="#fff" />
                        <Text className="text-center text-white mt-2 text-sm">Watch Live TV</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-primary p-4 rounded-lg w-[48%] mb-3 items-center"
                        onPress={() => router.push('/getStarted/signup')}
                    >
                        <MaterialIcons name="record-voice-over" size={24} color="#fff" />
                        <Text className="text-center text-white mt-2 text-sm">Submit Testimony</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-primary p-4 rounded-lg w-[48%] mb-3 items-center"
                        onPress={() => router.push('/store')}
                    >
                        <MaterialIcons name="storefront" size={24} color="#fff" />
                        <Text className="text-center text-white mt-2 text-sm">Visit Store</Text>
                    </TouchableOpacity>
                </View>


                {/*<View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>*/}
                {/*    <Text className="text-xl font-bold">*/}
                {/*        Loveworld Foundation School Promo*/}
                {/*    </Text>*/}
                {/*    <VideoPlayer*/}
                {/*        // title="Welcome Video"*/}
                {/*        videoSource="https://res.cloudinary.com/dfi8bpolg/video/upload/v1737680677/evtznnwqnmgyshvhzidd.mp4"*/}
                {/*    />*/}
                {/*</View>*/}



                {/* Testimonies */}
                <Text className="text-lg font-semibold px-4 mb-2">Recent Testimonies</Text>
                <ScrollView horizontal className="px-4 mb-6" showsHorizontalScrollIndicator={false}>
                    {[...Array(4)].map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            className="w-32 bg-gray-200 mr-3 rounded-lg p-2 items-center"
                            onPress={() => router.push('/testimony/testimony')}
                        >
                            <View className="w-full h-20 bg-gray-400 rounded-md mb-2" />
                            <Text className="text-sm font-medium">Testimony {index + 1}</Text>
                            <View className="h-2 bg-gray-300 w-3/4 rounded-full mt-1" />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Quick Links */}
                <Text className="text-lg font-semibold px-4 mb-2">Quick Links</Text>
                <View className="flex-row justify-between">
                    <TouchableOpacity className="bg-gray-100 p-4 w-[48%] rounded-lg items-center">
                        <Ionicons name="book-outline" size={20} />
                        <Text>Foundation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-100 p-4 w-[48%] rounded-lg items-center">
                        <Ionicons name="calendar-outline" size={20} />
                        <Text>Events</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </SidebarWithTopMenu>
        </>

    );
}
