import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    AppState,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video, { VideoRef } from 'react-native-video';

const screenWidth = Dimensions.get('window').width;
const videoHeight = screenWidth * (9 / 16); // 16:9 aspect ratio

type Props = {
    videoSource: string;
    style?: object;
    onFullscreenToggle?: (isFullscreen: boolean) => void;
    isFullscreenMode?: boolean;
};

export default function VideoScreen({ videoSource, style, onFullscreenToggle, isFullscreenMode = false }: Props) {
    const [isFullscreen, setIsFullscreen] = useState(isFullscreenMode);
    const [isLandscape, setIsLandscape] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<VideoRef>(null);
    const isFocused = useIsFocused();
    const appState = useRef(AppState.currentState);

    // Handle app state changes
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/active/) &&
                nextAppState.match(/inactive|background/)
            ) {
                videoRef.current?.pause();
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, []);

    // Handle screen focus
    useEffect(() => {
        if (!isFocused) {
            videoRef.current?.pause();
            handleExitFullscreen();
        }
    }, [isFocused]);

    // Handle cleanup on unmount
    useEffect(() => {
        return () => {
            handleExitFullscreen();
        };
    }, []);

    // Sync with external fullscreen state
    useEffect(() => {
        if (isFullscreenMode !== isFullscreen) {
            setIsFullscreen(isFullscreenMode);
        }
    }, [isFullscreenMode]);

    const handleRotation = () => {
        if (isLandscape) {
            Orientation.lockToPortrait();
            setIsLandscape(false);
        } else {
            Orientation.lockToLandscape();
            setIsLandscape(true);
        }
    };

    const handleExitFullscreen = () => {
        if (isFullscreen || isLandscape) {
            Orientation.lockToPortrait();
            setIsLandscape(false);
            setIsFullscreen(false);
            onFullscreenToggle?.(false);
        }
    };

    const handleFullscreenToggle = () => {
        const newFullscreenState = !isFullscreen;
        setIsFullscreen(newFullscreenState);
        onFullscreenToggle?.(newFullscreenState);
        handleRotation();
    };

    const handleError = (error: any) => {
        console.error('Video playback error:', error);
        setError('Failed to load video');
        setIsLoading(false);
    };

    return (
        <View style={[
            styles.videoContainer,
            style,
            isFullscreen && styles.fullscreenContainer
        ]}>
            <Video
                ref={videoRef}
                source={{ uri: videoSource }}
                style={[
                    styles.video,
                    isFullscreen && styles.fullscreenVideo
                ]}
                resizeMode={isFullscreen ? "cover" : "contain"}
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                onError={handleError}
                repeat={false}
                controls={true}
                fullscreen={isFullscreen}
                fullscreenOrientation="landscape"
                fullscreenAutorotate={true}
                onFullscreenPlayerWillPresent={() => {
                    setIsFullscreen(true);
                    onFullscreenToggle?.(true);
                }}
                onFullscreenPlayerWillDismiss={() => {
                    setIsFullscreen(false);
                    onFullscreenToggle?.(false);
                }}
            />
            {/* Loading Indicator */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Buffering...</Text>
                </View>
            )}
            {/* Error Message */}
            {error && (
                <View style={styles.errorOverlay}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            {/* Control Buttons */}
            <View style={styles.controlsContainer}>
                {isFullscreen && Platform.OS === 'ios' && (
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={handleRotation}
                    >
                        <Ionicons
                            name={isLandscape ? "phone-portrait" : "phone-landscape"}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleFullscreenToggle}
                >
                    <Ionicons
                        name={isFullscreen ? "contract" : "expand"}
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
        </View>
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
    fullscreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        elevation: 999999,
    },
    fullscreenVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
    controlsContainer: {
        position: 'absolute',
        bottom: 32,
        right: 32,
        flexDirection: 'row',
        gap: 16,
        zIndex: 2147483647,
    },
    controlButton: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
});