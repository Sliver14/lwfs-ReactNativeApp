import { useAuth } from '@/contexts/AuthContext';
import { useLiveTv } from '@/contexts/LiveTvContext';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    AppState,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const defaultVideoHeight = screenWidth * (9 / 16);

const relatedStreams = [
    { id: 1, title: "Morning Prayer", viewers: 1247, thumbnailColor: "#4A90E2" },
    { id: 2, title: "Bible Study", viewers: 856, thumbnailColor: "#F5A623" },
    { id: 3, title: "Evening Service", viewers: 2103, thumbnailColor: "#7ED321" },
];

export default function LiveTV() {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const [messageInput, setMessageInput] = useState('');
    const [viewerCountDisplay, setViewerCountDisplay] = useState(1247);
    const [isBuffering, setIsBuffering] = useState(true);

    const {
        currentProgram,
        comments,
        loadingProgram,
        loadingComments,
        error,
        fetchLiveProgram,
        postComment,
        recordParticipation,
    } = useLiveTv();

    // Create video player instance
    const player = useVideoPlayer(currentProgram?.videoUrl || '');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const chatScrollRef = useRef<FlatList>(null);
    const appState = useRef(AppState.currentState);

    const { userToken, loading } = useAuth();

    useEffect(() => {
        if (currentProgram?.viewerCount !== undefined) {
            setViewerCountDisplay(currentProgram.viewerCount);
        }
        if (currentProgram?.id) {
            recordParticipation();
        }
    }, [currentProgram, recordParticipation]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            appState.current = nextAppState;
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

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

    const renderMessage = ({ item }: { item: typeof comments[0] }) => {
        const firstName = item.user?.firstName || 'User';
        const lastName = item.user?.lastName || '';
        const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
        
        // Generate random beautiful colors for user avatars
        const beautifulColors = [
            '#FF6B6B', // Coral Red
            '#4ECDC4', // Turquoise
            '#45B7D1', // Sky Blue
            '#96CEB4', // Mint Green
            '#FFEAA7', // Soft Yellow
            '#DDA0DD', // Plum
            '#98D8C8', // Seafoam
            '#F7DC6F', // Golden Yellow
            '#BB8FCE', // Lavender
            '#85C1E9', // Light Blue
            '#F8C471', // Peach
            '#82E0AA', // Light Green
            '#F1948A', // Salmon
            '#85C1E9', // Powder Blue
            '#D7BDE2', // Light Purple
            '#FAD7A0', // Apricot
            '#A9CCE3', // Baby Blue
            '#ABEBC6', // Light Mint
            '#F9E79F', // Cream
            '#D5A6BD', // Rose Pink
        ];
        
        // Use initials to generate a consistent random color
        const colorIndex = Math.abs((initials.charCodeAt(0) + initials.charCodeAt(1)) % beautifulColors.length);
        const avatarColor = beautifulColors[colorIndex];
        
        return (
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [
                        {
                            translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            }),
                        },
                    ],
                }}
                className="flex-row px-2 gap-4 align-center items-center space-x-4 mb-3"
            >
                <View 
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{
                        backgroundColor: avatarColor,
                        shadowColor: avatarColor,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 6,
                    }}
                >
                    <Text className="text-white font-bold text-sm" style={{ fontWeight: '700' }}>{initials}</Text>
                </View>
                <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                        <Text className="font-semibold text-sm text-gray-800" style={{ fontWeight: '600' }}>
                            {firstName} {lastName}
                        </Text>
                        <Text className="text-xs text-gray-500" style={{ fontWeight: '400' }}>
                            {new Date(item.createdAt).toLocaleDateString([], { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </Text>
                    </View>
                    <Text className="text-sm text-gray-700 mt-1" style={{ fontWeight: '400' }}>{item.content}</Text>
                </View>
            </Animated.View>
        );
    };

    const renderRelatedStream = ({ item }: { item: typeof relatedStreams[0] }) => (
        <View className="bg-white rounded-xl overflow-hidden" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#E1E8ED'
        }}>
            <View style={[styles.thumbnail, { backgroundColor: item.thumbnailColor }]}>
                <Feather name="play" size={32} color="#fff" />
            </View>
            <View className="p-3">
                <Text className="font-semibold text-sm text-gray-800" style={{ fontWeight: '600' }}>{item.title}</Text>
                <Text className="text-xs text-gray-500" style={{ fontWeight: '400' }}>🔴 {item.viewers} viewers</Text>
            </View>
        </View>
    );

    if (loadingProgram) {
        return (
            <View style={styles.fullscreenCenter}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Loading Live Program...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.fullscreenCenter}>
                <Feather name="alert-triangle" size={40} color="#F44336" />
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity onPress={fetchLiveProgram} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!currentProgram) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Feather name="video-off" size={60} color="#657786" />
                <Text style={styles.emptyStateText}>No live program currently available</Text>
            </View>
        );
    }

    const { title, description } = currentProgram;

    return (
        <SafeAreaView className="flex-1 pb-[87px]" style={{ backgroundColor: '#F5F7FA' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
            <View className="flex-1">
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
                        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                        {/* Video Player Section */}
                        <View style={styles.videoSection}>
                            <View
                                style={[
                                    styles.videoContainer,
                                    {
                                        width: screenWidth - 32,
                                        height: defaultVideoHeight,
                                        borderRadius: 16,
                                        marginHorizontal: 16,
                                    },
                                ]}
                            >
                                <VideoView
                                    player={player}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="contain"
                                    nativeControls={true}
                                    allowsFullscreen={true}
                                />
                            </View>
                            
                            {/* Program Title Section */}
                            <View className="px-4 pt-4 pb-2">
                                {/* <View className="flex-row items-center mb-2">
                                    <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                                    <Text className="text-sm text-red-500 font-semibold" style={{ fontWeight: '600' }}>
                                        LIVE NOW
                                    </Text>
                                </View> */}
                                <Text className="text-xl font-bold text-gray-800" style={{ fontWeight: '700' }}>
                                    {title || 'Live Program'}
                                </Text>
                            </View>
                        </View>

                        {/* Live Chat Section */}
                        <View className="bg-white rounded-2xl p-4 mx-4 mb-4" style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 6,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: '#E1E8ED'
                        }}>
                            <View className="flex-row items-center mb-4">
                                <Feather name="message-circle" size={20} color="#453ace" />
                                <Text className="font-semibold text-lg text-gray-800 ml-2" style={{ fontWeight: '600' }}>Live Chat</Text>
                                {loadingComments && <ActivityIndicator size="small" color="#453ace" className="ml-2" />}
                            </View>
                            
                            <View style={{ minHeight: 160, maxHeight: 250, backgroundColor: '#F6F8FA', borderRadius: 8 }}>
                                <FlatList
                                    ref={chatScrollRef}
                                    data={comments}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={true}
                                    scrollEnabled={true}
                                    nestedScrollEnabled={true}
                                    renderItem={renderMessage}
                                    contentContainerStyle={styles.chatListContent}
                                    ListEmptyComponent={() => (
                                        !loadingComments && (
                                            <View className="py-4">
                                                <Text className="text-gray-500 text-sm text-center" style={{ fontWeight: '400' }}>
                                                    No comments yet. Be the first to say something!
                                                </Text>
                                            </View>
                                        )
                                    )}
                                />
                            </View>
                            
                            <View className="flex-row items-center space-x-2 mt-4 p-3 bg-gray-50 rounded-xl">
                                <TextInput
                                    value={messageInput}
                                    onChangeText={setMessageInput}
                                    placeholder="Type a message..."
                                    className="flex-1 text-sm text-gray-800"
                                    placeholderTextColor="#657786"
                                    multiline={false}
                                    returnKeyType="send"
                                    onSubmitEditing={handleSendMessage}
                                    style={{ fontWeight: '400' }}
                                />
                                <TouchableOpacity
                                    onPress={handleSendMessage}
                                    className="p-1"
                                    disabled={!messageInput.trim()}
                                >
                                    <Feather
                                        name="send"
                                        size={20}
                                        color={messageInput.trim() ? '#453ace' : '#657786'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    fullscreenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoSection: {
        paddingVertical: 16,
        backgroundColor: '#fff',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    videoContainer: {
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    thumbnail: {
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatListContent: {
        padding: 16,
    },
    loadingText: {
        color: '#657786',
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    errorText: {
        color: '#F44336',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
        fontWeight: '500',
    },
    emptyStateText: {
        color: '#657786',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
        fontWeight: '500',
    },
    retryButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});