import { Ionicons, Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    AppState,
    ActivityIndicator
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useLiveTv } from '@/contexts/LiveTvContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const defaultVideoHeight = screenWidth * (9 / 16); // 16:9 aspect ratio
const BOTTOM_TAB_BAR_HEIGHT = 80; // Adjust based on your tab bar height

// Messages array (used as fallback mock data)
const messages = [
    { id: 1, name: 'Emmanuel Dickson', message: 'Great show tonight! 🔥', isOnline: true, timestamp: '2 min ago' },
    { id: 2, name: 'Sarah Johnson', message: 'Loving the content, keep it up!', isOnline: false, timestamp: '5 min ago' },
    { id: 3, name: 'Mike Chen', message: 'Can you talk about tech news next?', isOnline: true, timestamp: '8 min ago' },
    { id: 4, name: 'Lisa Brown', message: 'Hello from New York! 👋', isOnline: true, timestamp: '12 min ago' },
    { id: 5, name: 'David Wilson', message: 'This stream quality is amazing', isOnline: false, timestamp: '15 min ago' },
    { id: 6, name: 'Grace Lim', message: 'First time watching, great vibes!', isOnline: true, timestamp: '18 min ago' },
    { id: 7, name: 'Omar Khan', message: 'Any shoutouts for viewers in London?', isOnline: false, timestamp: '20 min ago' },
    { id: 8, name: 'Sophie Davis', message: 'Laughing so hard right now 😂', isOnline: true, timestamp: '23 min ago' },
];

export default function LiveTV() {
    const isFocused = useIsFocused();
    const [messageInput, setMessageInput] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewerCountDisplay, setViewerCountDisplay] = useState(1247);

    const {
        currentProgram,
        comments,
        loadingProgram,
        loadingComments,
        error,
        fetchLiveProgram,
        postComment,
        recordParticipation
    } = useLiveTv();

    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const chatScrollRef = useRef<FlatList>(null);
    const appState = useRef(AppState.currentState);

    // Conditionally initialize player
    const player = currentProgram?.videoUrl
        ? useVideoPlayer(currentProgram.videoUrl, (p) => {
            p.loop = false;
            p.pause();
        })
        : null;

    // Effect to handle viewer count display and participation
    useEffect(() => {
        if (currentProgram?.viewerCount !== undefined) {
            setViewerCountDisplay(currentProgram.viewerCount);
        }
        if (currentProgram?.id) {
            recordParticipation();
        }
    }, [currentProgram, recordParticipation]);

    // Effect for player state changes and subscriptions
    useEffect(() => {
        if (!player) return;

        const playingSubscription = player.addListener('playingChange', (playing) => {
            setIsPlaying(playing);
            if (playing) setIsBuffering(false);
        });

        const playbackStateSubscription = player.addListener('playbackStateChange', (state) => {
            if (state === 'playing') {
                setIsBuffering(false);
            } else if (state === 'paused' && player.currentTime > 0) {
                setIsBuffering(false);
            } else if (state === 'stalled' || state === 'loading' || (state === 'paused' && player.currentTime === 0 && isPlaying)) {
                setIsBuffering(true);
            }
        });

        if (player.state === 'loading' || player.state === 'stalled') {
            setIsBuffering(true);
        } else {
            setIsBuffering(false);
        }

        return () => {
            playingSubscription.remove();
            playbackStateSubscription.remove();
        };
    }, [player, isPlaying]);

    // Effect to pause video when screen loses focus
    useEffect(() => {
        if (!isFocused && player) {
            player.pause();
            setIsPlaying(false);
        }
    }, [isFocused, player]);

    // Effect to handle app state changes (background/foreground)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (player && appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
                player.pause();
                setIsPlaying(false);
            }
            appState.current = nextAppState;
        });
        return () => subscription.remove();
    }, [player]);

    // Animation for chat messages
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    // Scroll to end when new comments are added
    useEffect(() => {
        if (comments.length > 0) {
            setTimeout(() => {
                chatScrollRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [comments]);

    const handleSendMessage = async () => {
        if (messageInput.trim()) {
            await postComment(messageInput.trim());
            setMessageInput('');
        }
    };

    // Handle fullscreen toggle from native controls
    const handleFullscreenUpdate = (isFullscreen: boolean) => {
        setIsFullscreen(isFullscreen);
        StatusBar.setHidden(isFullscreen, 'fade');
    };

    const renderMessage = ({ item }: { item: typeof comments[0] }) => (
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
            className="flex-row items-start mb-3 px-4"
        >
            <View className="relative">
                <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3 shadow-sm">
                    <Text className="text-white font-bold text-base">
                        {item.user.firstName.charAt(0).toUpperCase()}
                    </Text>
                </View>
            </View>
            <View className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                <View className="flex-row items-center justify-between mb-0.5">
                    <Text className="font-semibold text-gray-800 text-sm">
                        {item.user.firstName} {item.user.lastName}
                    </Text>
                    <Text className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <Text className="text-gray-700 text-sm leading-tight">{item.content}</Text>
            </View>
        </Animated.View>
    );

    // Conditional Rendering for Loading, Error, and Empty States
    if (loadingProgram) {
        return (
            <View style={styles.fullscreenCenter}>
                <ActivityIndicator size="large" color="#453ace" />
                <Text style={styles.loadingText}>Loading Live Program...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.fullscreenCenter}>
                <Feather name="alert-triangle" size={40} color="#EF4444" />
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity onPress={fetchLiveProgram} className="mt-4 p-3 bg-blue-500 rounded-md">
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!currentProgram) {
        return (
            <View style={styles.fullscreenCenter}>
                <Feather name="video-off" size={60} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No live program currently available.</Text>
            </View>
        );
    }

    // Main UI Rendering
    return (
        <View style={styles.container}>
            {!isFullscreen && <StatusBar barStyle="dark-content" backgroundColor="#fff" />}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                {/* Header - Conditionally rendered */}
                {!isFullscreen && (
                    <View className="bg-white px-4 py-3 border-b border-gray-100 shadow-sm">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-xl font-bold text-gray-800">Live TV</Text>
                                <Text className="text-gray-600 text-sm">{currentProgram.title}</Text>
                            </View>
                            {/*<TouchableOpacity className="p-2">*/}
                            {/*    /!*<Feather name="settings" size={20} color="#6B7280" />*!/*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                    </View>
                )}

                {/* Video Player Container */}
                <View style={[
                    styles.videoContainer,
                    isFullscreen
                        ? { width: screenWidth, height: screenHeight, position: 'absolute', top: 0, left: 0, zIndex: 9999 }
                        : { width: screenWidth, height: defaultVideoHeight }
                ]}>
                    {player ? (
                        <>
                            <VideoView
                                player={player}
                                style={StyleSheet.absoluteFillObject}
                                resizeMode={isFullscreen ? "cover" : "contain"}
                                allowsFullscreen={true}
                                showsControls={true}
                                onFullscreenUpdate={({ fullscreen }) => handleFullscreenUpdate(fullscreen)}
                            />
                            {isBuffering && (
                                <View style={styles.loadingOverlay}>
                                    <ActivityIndicator size="large" color="#fff" />
                                    <Text style={styles.loadingText}>Buffering...</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={styles.videoPlaceholder}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.loadingText}>Loading video stream...</Text>
                        </View>
                    )}
                </View>

                {/* Live Chat Section - Only visible when not in fullscreen */}
                {!isFullscreen && (
                    <View className="flex-1 bg-white">
                        {/* Chat Header */}
                        <View className="bg-white px-4 py-3 border-b border-gray-100">
                            <Text className="text-lg font-bold text-gray-800">Live Chat</Text>
                            <Text className="text-sm text-gray-600">Join the conversation</Text>
                            {loadingComments && <ActivityIndicator size="small" color="#453ace" className="ml-2" />}
                        </View>

                        {/* Message List */}
                        <FlatList
                            ref={chatScrollRef}
                            data={comments}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderMessage}
                            contentContainerStyle={[styles.chatListContent, { paddingBottom: 80 }]}
                            ListEmptyComponent={() => (
                                !loadingComments && (
                                    <View style={styles.emptyChatContainer}>
                                        <Text style={styles.emptyChatText}>No comments yet. Be the first to say something!</Text>
                                    </View>
                                )
                            )}
                        />

                        {/* Message Input Area */}
                        <View className="bg-white border-t mb-[85px] border-gray-200 px-4 py-3 absolute bottom-0 left-0 right-0">
                            <View className="flex-row items-center bg-gray-50 rounded-full px-4 py-2 shadow-sm">
                                <TextInput
                                    value={messageInput}
                                    onChangeText={setMessageInput}
                                    placeholder="Type your message..."
                                    className="flex-1 text-base text-gray-800"
                                    placeholderTextColor="#9CA3AF"
                                    multiline={false}
                                    returnKeyType="send"
                                    onSubmitEditing={handleSendMessage}
                                />
                                <TouchableOpacity
                                    onPress={handleSendMessage}
                                    className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
                                        messageInput.trim() ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                                    disabled={!messageInput.trim()}
                                >
                                    <Ionicons
                                        name="send"
                                        size={18}
                                        color={messageInput.trim() ? "white" : "#9CA3AF"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    videoContainer: {
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    videoPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
    chatListContent: {
        paddingTop: 8,
        paddingBottom: 16,
    },
    fullscreenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    emptyStateText: {
        color: '#6B7280',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    emptyChatContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyChatText: {
        color: '#9CA3AF',
        fontSize: 14,
        textAlign: 'center',
    },
});