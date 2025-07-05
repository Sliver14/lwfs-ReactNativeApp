import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import EventCarousel from '../../../components/EventCarousal';
import { useUser } from '../../../contexts/UserContext';

export default function Index() {
    const router = useRouter();
    const { userDetails } = useUser();

    const handleOnlineClass = async () => {
        try {
            await WebBrowser.openBrowserAsync('https://online-school-olive.vercel.app/');
        } catch (error) {
            console.error('Error opening online class:', error);
        }
    };

    const handleTestimonies = async () => {
        try {
            await WebBrowser.openBrowserAsync('https://lwfoundationschool.org/testimonybank/');
        } catch (error) {
            console.error('Error opening testimonies:', error);
        }
    };

    const quickActions = [
        { icon: 'tv' as const, label: 'Watch Live', color: '#F44336', gradient: ['#F44336', '#E91E63'] as [string, string], action: () => router.push('/livetv') },
        { icon: 'search' as const, label: 'Online Class', color: '#7B68EE', gradient: ['#7B68EE', '#9C27B0'] as [string, string], action: handleOnlineClass },
        { icon: 'star' as const, label: 'Testimonies', color: '#FFD93D', gradient: ['#FFD93D', '#FF9800'] as [string, string], action: handleTestimonies },
        { icon: 'storefront' as const, label: 'Store', color: '#4CAF50', gradient: ['#4CAF50', '#8BC34A'] as [string, string], action: () => router.push('/store') }
    ];

    const upcomingEvents = [
        { title: 'Live Concert Stream', time: '8:00 PM', date: 'Today', color: '#7B68EE', gradient: ['#7B68EE', '#9C27B0'] as [string, string] },
        { title: 'Product Launch', time: '2:00 PM', date: 'Tomorrow', color: '#4A90E2', gradient: ['#4A90E2', '#2196F3'] as [string, string] },
        { title: 'Community Meetup', time: '6:00 PM', date: 'July 3', color: '#4CAF50', gradient: ['#4CAF50', '#8BC34A'] as [string, string] },
        { title: 'Prayer Session', time: '7:00 AM', date: 'July 4', color: '#FF8C42', gradient: ['#FF8C42', '#FF9800'] as [string, string] }
    ];

    return (
        <SafeAreaView className="flex-1 pb-[87px]" style={{ backgroundColor: '#F5F7FA' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
            <ScrollView className="flex-1 w-screen" showsVerticalScrollIndicator={false}>
                
                {/* LWFS Header */}
                <LinearGradient
                    colors={['#4A90E2', '#7B68EE']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    className="rounded-b-3xl p-6 mx-4 mt-4"
                    style={{
                        shadowColor: '#4A90E2',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.25,
                        shadowRadius: 12,
                        elevation: 12,
                        borderRadius: 20,
                    }}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row gap-5 items-center">
                            <View className="w-16 h-16 rounded-full items-center justify-center" >
                                <Image source={require('../../../assets/images/icon.png')} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                            </View>
                            <View>
                                <Text className="text-xl font-bold text-white" style={{ fontFamily: 'System', fontWeight: '700' }}>
                                    Welcome to
                                </Text>
                                <Text className="text-lg font-semibold text-white" style={{ fontFamily: 'System', fontWeight: '600', opacity: 0.9 }}>
                                    LoveWorld Foundation School
                                </Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Quick Actions */}
                <View className="px-4 mt-6">
                    <View className="flex-row flex-wrap justify-between">
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                className="bg-white rounded-xl p-4 w-[22%] mb-4 items-center"
                                onPress={action.action}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 8,
                                    elevation: 6,
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    borderColor: '#E1E8ED'
                                }}>
                                <LinearGradient
                                    colors={action.gradient}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                                    style={{
                                        shadowColor: action.color,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 6,
                                        borderRadius: 24
                                    }}
                                >
                                    <MaterialIcons name={action.icon} size={24} color="#fff" />
                                </LinearGradient>
                                <Text className="text-xs text-gray-600 text-center" style={{ fontFamily: 'System', fontWeight: '500' }}>
                                    {action.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Featured Content */}
                <View className="px-4 mt-6">
                <Text className="text-lg font-semibold mb-4 text-gray-800" style={{ fontFamily: 'System', fontWeight: '600' }}>
                    Featured Today
                </Text>
                <LinearGradient
                    colors={['#FF8C42', '#FFD93D']}
                    start={[0, 0]}
                    end={[1, 0]}
                    className="rounded-2xl p-6 relative overflow-hidden"
                    style={{
                        shadowColor: '#FF8C42',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.25,
                        shadowRadius: 12,
                        elevation: 8,
                        borderRadius: 16,
                        minHeight: 140
                    }}
                >
                    <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full"
                        style={{ transform: [{ translateY: -64 }, { translateX: 64 }] }} />
                    <Text className="text-xl font-bold mb-2 text-white" style={{ fontFamily: 'System', fontWeight: '700' }}>
                        Graduation Season
                    </Text>
                    <Text className="text-white mb-4" style={{ fontFamily: 'System', fontWeight: '400', opacity: 0.9 }}>
                        Up to 20% off on selected items
                    </Text>
                    <TouchableOpacity 
                        className="bg-white px-6 py-3 rounded-full self-start"
                        onPress={() => router.push('/store')}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3
                        }}>
                        <Text className="text-orange-500 font-semibold" style={{ fontFamily: 'System', fontWeight: '600' }}>
                            Shop Now
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
                </View>

                <EventCarousel/>

            </ScrollView>
        </SafeAreaView>
    );
}