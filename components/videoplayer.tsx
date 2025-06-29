import { Ionicons, Feather } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    AppState,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const videoHeight = screenWidth * (9 / 16); // 16:9 aspect ratio

type Props = {
    videoSource: string;
    style?: object;
    onFullscreenToggle?: (isFullscreen: boolean) => void;
};

export default function VideoScreen({ videoSource, style, onFullscreenToggle }: Props) {
    const player = useVideoPlayer(videoSource, player => {
        player.loop = false; // Changed to false to match LiveTV behavior
        player.pause();
    });

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });
    const [isMuted, setIsMuted] = useState(true);
    const [isBuffering, setIsBuffering] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const isFocused = useIsFocused();
    const appState = useRef(AppState.currentState);

    // Initial mute setting
    useEffect(() => {
        if (player) {
            player.muted = true;
        }
    }, [player]);

    // Handle video state changes
    useEffect(() => {
        const unsubscribePlaying = player.addListener('playingChange', (playing) => {
            setIsBuffering(false);
        });
        const unsubscribePlaybackState = player.addListener('playbackStateChange', (state) => {
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
            unsubscribePlaying();
            unsubscribePlaybackState();
        };
    }, [player, isPlaying]);

    // Handle app state changes
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/active/) &&
                nextAppState.match(/inactive|background/)
            ) {
                player.pause();
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, [player]);

    // Handle screen focus
    useEffect(() => {
        if (!isFocused) {
            player.pause();
        }
    }, [isFocused, player]);

    const handlePlayPause = () => {
        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
    };

    const toggleMute = () => {
        if (player) {
            setIsMuted(prev => !prev);
            player.muted = !isMuted;
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(prev => {
            const newState = !prev;
            if (onFullscreenToggle) {
                onFullscreenToggle(newState);
            }
            return newState;
        });
    };

    return (
        <View style={[styles.videoContainer, style]}>
            <VideoView
                style={StyleSheet.absoluteFillObject}
                player={player}
                allowsFullscreen={false} // Disable native fullscreen to use custom
                allowsPictureInPicture={false}
                showsControls={false}
                resizeMode={isFullscreen ? "cover" : "contain"}
            />

            {/* Loading Indicator */}
            {isBuffering && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Buffering...</Text>
                </View>
            )}

            {/* Video Overlay Controls */}
            <View style={styles.controlsOverlay}>
                {/* Middle Play/Pause Button */}
                <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
                    <Feather name={isPlaying ? "pause" : "play"} size={40} color="white" />
                </TouchableOpacity>

                {/* Bottom Controls (Mute, Fullscreen) */}
                <View style={styles.bottomControls}>
                    <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                        <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleFullscreen} style={styles.controlButton}>
                        <Feather name={isFullscreen ? "minimize-2" : "maximize-2"} size={24} color="white" />
                    </TouchableOpacity>
                </View>
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
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    playPauseButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 50,
        padding: 10,
    },
    bottomControls: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controlButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
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
});