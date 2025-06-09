import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, TouchableOpacity, Text, AppState, AppStateStatus } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';

type Props = {
    videoSource: string;
};

export default function VideoScreen({ videoSource }: Props) {
    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.pause();
    });

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });

    const [isMuted, setIsMuted] = useState(true);
    const isFocused = useIsFocused();
    const appState = useRef(AppState.currentState);

    const toggleMute = () => {
        if (player) {
            setIsMuted(prev => !prev);
            player.muted = !isMuted;
        }
    };

    // Handle app state changes (background, inactive)
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

    return (
        <View style={styles.contentContainer}>
            <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen={true}
                allowsPictureInPicture={false}
                showsControls={false}
            />

            <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
                <Text style={styles.muteButtonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
    },
    video: {
        width: 400,
        height: 275,
        backgroundColor: '#000',
    },
    muteButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    muteButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
