import VideoScreen from '@/components/videoplayer';
import { useAuth } from '@/contexts/AuthContext';
import { useLiveTv } from '@/contexts/LiveTvContext';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
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
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const defaultVideoHeight = screenWidth * (9 / 16);

const relatedStreams = [
  { id: '1', title: 'Gaming Stream', viewers: '856', thumbnailColor: '#4CAF50' },
  { id: '2', title: 'Music Live', viewers: '1.2K', thumbnailColor: '#7B68EE' },
];

export default function LiveTV() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [messageInput, setMessageInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerCountDisplay, setViewerCountDisplay] = useState(1247);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const { showFullscreenVideo, hideFullscreenVideo } = useVideoPlayer();

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
    if (!isFocused) {
      setIsPlaying(false);
    }
  }, [isFocused]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        setIsPlaying(false);
      }
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

  useEffect(() => {
    if (currentProgram?.videoUrl) {
      showFullscreenVideo(currentProgram.videoUrl);
    }
    return () => {
      hideFullscreenVideo();
    };
  }, [currentProgram?.videoUrl, showFullscreenVideo, hideFullscreenVideo]);

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      await postComment(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleFullscreenToggle = (fullscreen: boolean) => {
    setIsFullscreen(fullscreen);
    if (fullscreen) {
      showFullscreenVideo(currentProgram.videoUrl);
    } else {
      hideFullscreenVideo();
    }
    StatusBar.setHidden(fullscreen, 'fade');
  };

  const renderMessage = ({ item }: { item: typeof comments[0] }) => {
    const firstName = item.user?.firstName || 'User';
    const lastName = item.user?.lastName || '';
    const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
    
    // Generate consistent color based on user initials using design system colors
    const colors = [
      ['#F44336', '#E91E63'], // Red
      ['#4CAF50', '#8BC34A'], // Green
      ['#2196F3', '#4A90E2'], // Blue
      ['#FF9800', '#FF8C42'], // Orange
      ['#9C27B0', '#7B68EE'], // Purple
      ['#00BCD4', '#4CAF50'], // Cyan
      ['#FF5722', '#FF8C42'], // Deep Orange
      ['#795548', '#8D6E63'], // Brown
    ];
    
    const colorIndex = (initials.charCodeAt(0) + initials.charCodeAt(1)) % colors.length;
    const avatarColors = colors[colorIndex];
    
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
            backgroundColor: avatarColors[0],
            shadowColor: avatarColors[0],
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
            {!isFullscreen && <StatusBar barStyle="dark-content" backgroundColor="#fff" />}
            {/* Video Player Section */}
            <View style={styles.videoSection}>
              {!isFullscreen && (
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
                  <VideoScreen
                    videoSource={currentProgram?.videoUrl || ''}
                    onFullscreenToggle={handleFullscreenToggle}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              )}
            </View>

            {!isFullscreen && (
              <>
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
                    <Feather name="message-circle" size={20} color="#4A90E2" />
                    <Text className="font-semibold text-lg text-gray-800 ml-2" style={{ fontWeight: '600' }}>Live Chat</Text>
                    {loadingComments && <ActivityIndicator size="small" color="#4A90E2" className="ml-2" />}
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
                        color={messageInput.trim() ? '#4A90E2' : '#657786'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
  centerContent: ViewStyle;
  contentContainer: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  emptyStateText: TextStyle;
  videoSection: ViewStyle;
  videoContainer: ViewStyle;
  playButton: ViewStyle;
  videoInfoOverlay: ViewStyle;
  videoInfoContent: ViewStyle;
  videoTitle: TextStyle;
  viewerCount: TextStyle;
  videoControls: ViewStyle;
  videoPlaceholder: ViewStyle;
  loadingOverlay: ViewStyle;
  loadingText: TextStyle;
  chatListContent: ViewStyle;
  thumbnail: ViewStyle;
  fullscreenCenter: ViewStyle;
  errorText: TextStyle;
  retryButton: ViewStyle;
  retryButtonText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  videoSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  videoInfoContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: 12,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  viewerCount: {
    color: '#d1d5db',
    fontSize: 14,
  },
  videoControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 2,
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  chatListContent: {
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  thumbnail: {
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});