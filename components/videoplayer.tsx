import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { ResizeMode, Video, VideoFullscreenUpdate } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const videoHeight = screenWidth * (9 / 16); // 16:9 aspect ratio
const CONTROLS_TIMEOUT = 3000; // 3 seconds

type Props = {
    videoSource: string;
    style?: object;
};

export default function VideoScreen({ videoSource, style }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPortrait, setIsPortrait] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const videoRef = useRef<Video>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [controlsVisible, setControlsVisible] = useState(true);
    const isFocused = useIsFocused();

    // Set initial orientation lock to portrait
    useEffect(() => {
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
        };
        lockOrientation();
    }, []);

    // Handle tab focus changes
    useEffect(() => {
        if (videoRef.current) {
            if (!isFocused) {
                // Pause video when tab loses focus
                videoRef.current.pauseAsync();
                setIsPlaying(false);
            } else if (isPlaying) {
                // Resume video when tab gains focus if it was playing before
                videoRef.current.playAsync();
            }
        }
    }, [isFocused]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            // Lock orientation back to portrait when component unmounts
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
        };
    }, []);

    // Handle controls visibility animation
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: controlsVisible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        if (controlsVisible && isFullscreen) {
            startControlsTimer();
        }
    }, [controlsVisible, isFullscreen]);

    const startControlsTimer = () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            setControlsVisible(false);
        }, CONTROLS_TIMEOUT);
    };

    const showControls = () => {
        setControlsVisible(true);
        startControlsTimer();
    };

    const handleTap = () => {
        if (isFullscreen) {
            showControls();
        }
    };

    const handleError = (error: any) => {
        console.error('Video playback error:', error);
        setError('Failed to load video');
        setIsLoading(false);
    };

    const handleFullscreenUpdate = async ({ fullscreenUpdate }: { fullscreenUpdate: VideoFullscreenUpdate }) => {
        switch (fullscreenUpdate) {
            case VideoFullscreenUpdate.PLAYER_WILL_PRESENT:
                setIsFullscreen(true);
                setControlsVisible(true);
                // Allow all orientations in fullscreen
                await ScreenOrientation.unlockAsync();
                // Check orientation when entering fullscreen
                const orientation = await ScreenOrientation.getOrientationAsync();
                setIsPortrait(orientation === ScreenOrientation.Orientation.PORTRAIT_UP);
                startControlsTimer();
                break;
            case VideoFullscreenUpdate.PLAYER_WILL_DISMISS:
                setIsFullscreen(false);
                setControlsVisible(true);
                // Lock back to portrait when exiting fullscreen
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP
                );
                if (controlsTimeoutRef.current) {
                    clearTimeout(controlsTimeoutRef.current);
                }
                break;
        }
    };

    const toggleFullscreen = async () => {
        try {
            if (videoRef.current) {
                if (isFullscreen) {
                    await videoRef.current.dismissFullscreenPlayer();
                } else {
                    await videoRef.current.presentFullscreenPlayer();
                }
                showControls();
            }
        } catch (error) {
            console.error('Error toggling fullscreen:', error);
        }
    };

    // Listen for orientation changes
    useEffect(() => {
        const subscription = ScreenOrientation.addOrientationChangeListener(async (event) => {
            const isPortraitMode = event.orientationInfo.orientation === ScreenOrientation.Orientation.PORTRAIT_UP;
            setIsPortrait(isPortraitMode);
            if (isFullscreen) {
                showControls();
            }
        });

        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, [isFullscreen]);

    return (
        <>
            <View style={[styles.videoContainer, style]}>
                <Video
                    ref={videoRef}
                    source={{ uri: videoSource }}
                    style={styles.video}
                    resizeMode={ResizeMode.CONTAIN}
                    onLoadStart={() => setIsLoading(true)}
                    onLoad={() => setIsLoading(false)}
                    onError={handleError}
                    shouldPlay={isFocused && isPlaying}
                    useNativeControls
                    isLooping={false}
                    onFullscreenUpdate={handleFullscreenUpdate}
                    onPlaybackStatusUpdate={(status: any) => {
                        if (status?.isLoaded) {
                            setIsPlaying(status.isPlaying);
                            setIsLoading(false);
                        }
                    }}
                />
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Buffering...</Text>
                    </View>
                )}
                {error && (
                    <View style={styles.errorOverlay}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
            </View>
            
            {/* Fullscreen Controls Modal */}
            {isFullscreen && (
                <Modal
                    transparent={true}
                    visible={true}
                    animationType="none"
                    supportedOrientations={['portrait', 'landscape']}
                >
                    <TouchableWithoutFeedback onPress={handleTap}>
                        <View style={styles.fullscreenOverlay}>
                            <Animated.View 
                                style={[
                                    styles.controlsContainer,
                                    { opacity: fadeAnim }
                                ]}
                                pointerEvents={controlsVisible ? 'auto' : 'none'}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.fullscreenButton,
                                        isPortrait && styles.fullscreenButtonPortrait
                                    ]}
                                    onPress={toggleFullscreen}
                                >
                                    <Ionicons
                                        name="contract"
                                        size={32}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    videoContainer: {
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        height: videoHeight,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
    errorOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    fullscreenOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    controlsContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    fullscreenButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 12,
        borderRadius: 12,
        zIndex: 9999,
        elevation: 5,
    },
    fullscreenButtonPortrait: {
        top: Platform.OS === 'ios' ? 60 : 40, // Account for status bar in portrait mode
    },
});