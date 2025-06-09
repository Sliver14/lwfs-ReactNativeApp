import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Dimensions,
    AppState,
    AppStateStatus,
    SafeAreaView,
    StatusBar,
    Animated,
    KeyboardAvoidingView,
    Platform, ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const messages = [
    { id: 1, name: 'Emmanuel Dickson', message: 'Great show tonight! 🔥', isOnline: true, timestamp: '2 min ago' },
    { id: 2, name: 'Sarah Johnson', message: 'Loving the content, keep it up!', isOnline: false, timestamp: '5 min ago' },
    { id: 3, name: 'Mike Chen', message: 'Can you talk about tech news next?', isOnline: true, timestamp: '8 min ago' },
    { id: 4, name: 'Lisa Brown', message: 'Hello from New York! 👋', isOnline: true, timestamp: '12 min ago' },
    { id: 5, name: 'David Wilson', message: 'This stream quality is amazing', isOnline: false, timestamp: '15 min ago' },
];

export default function LiveTV() {
    const isFocused = useIsFocused();
    const [message, setMessage] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewerCount, setViewerCount] = useState(1247);
    const [isPlaying, setIsPlaying] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const chatScrollRef = useRef(null);

    const player = useVideoPlayer(
        'https://2nbyjxnbl53k-hls-live.5centscdn.com/RTV/59a49be6dc0f146c57cd9ee54da323b1.sdp/chunks.m3u8',
        (p) => {
            p.loop = false;
            p.pause();
        }
    );

    useEffect(() => {
        if (!isFocused) {
            player.pause();
            setIsPlaying(false);
        }
    }, [isFocused]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePlayPause = () => {
        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
        setIsPlaying(!isPlaying);
    };

    const sendMessage = () => {
        if (message.trim()) {
            // Here you would typically send the message to your backend
            setMessage('');
            // Auto scroll to bottom after sending
            setTimeout(() => {
                chatScrollRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const renderMessage = ({ item, index }) => (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{
                    translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                    }),
                }],
            }}
            className="flex-row items-start mb-4 px-4"
        >
            <View className="relative">
                <View className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center mr-3 shadow-lg">
                    <Text className="text-white font-bold text-lg">
                        {item.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                {item.isOnline && (
                    <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
            </View>
            <View className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 shadow-sm">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-semibold text-gray-800 text-base">{item.name}</Text>
                    <Text className="text-xs text-gray-500">{item.timestamp}</Text>
                </View>
                <Text className="text-gray-700 text-sm leading-5">{item.message}</Text>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 mb-[35px] bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="bg-white px-4 py-3 border-b border-gray-100 shadow-sm">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-xl font-bold text-gray-800">Live TV</Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    ref={chatScrollRef}
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View>
                            {/* Video Player Container */}
                            <View className="relative bg-black">
                                <VideoView
                                    player={player}
                                    style={{
                                        width: screenWidth,
                                        height: isFullscreen ? screenHeight * 0.6 : 240,
                                    }}
                                    resizeMode="contain"
                                />

                                {/* Live Badge */}
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.6)', 'transparent']}
                                    className="absolute top-0 left-0 right-0 h-20"
                                >
                                    <View className="flex-row items-center justify-between p-4">
                                        <View className="bg-red-600 px-3 py-1.5 rounded-full flex-row items-center">
                                            <View className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                            <Text className="text-white text-xs font-bold">LIVE</Text>
                                        </View>
                                        <View className="bg-black/50 px-3 py-1.5 rounded-full">
                                            {/*<Text className="text-white text-xs font-medium">*/}
                                            {/*    {viewerCount.toLocaleString()} watching*/}
                                            {/*</Text>*/}
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>

                            {/* Chat Header */}
                            <View className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-4 border-b border-gray-100">
                                <View className="flex-row items-center justify-between">
                                    <View>
                                        <Text className="text-lg font-bold text-gray-800">Live Chat</Text>
                                        <Text className="text-sm text-gray-600">Join the conversation</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    renderItem={renderMessage}
                    contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
                />
                {/* Message Input */}
                <View className=" bg-white border-t border-gray-200 mb-[35px] px-4 py-3">
                    <View className="flex-row items-center bg-gray-50 rounded-full px-4 py-3 shadow-sm">
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type your message..."
                            className="flex-1 text-base text-gray-800"
                            placeholderTextColor="#9CA3AF"
                            multiline={false}
                            returnKeyType="send"
                            onSubmitEditing={sendMessage}
                        />
                        <TouchableOpacity
                            onPress={sendMessage}
                            className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
                                message.trim() ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                            disabled={!message.trim()}
                        >
                            <Ionicons
                                name="send"
                                size={18}
                                color={message.trim() ? "white" : "#9CA3AF"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>


            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}