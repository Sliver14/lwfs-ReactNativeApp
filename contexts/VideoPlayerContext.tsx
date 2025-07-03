import * as ScreenOrientation from 'expo-screen-orientation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import VideoPlayer from '../components/videoplayer';

type VideoPlayerContextType = {
    showFullscreenVideo: (videoUrl: string) => void;
    hideFullscreenVideo: () => void;
    isFullscreen: boolean;
};

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export const useVideoPlayer = () => {
    const context = useContext(VideoPlayerContext);
    if (!context) {
        throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
    }
    return context;
};

export const VideoPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Reset orientation when component unmounts
    useEffect(() => {
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };
    }, []);

    const showFullscreenVideo = (url: string) => {
        setVideoUrl(url);
        setIsFullscreen(true);
    };

    const hideFullscreenVideo = async () => {
        setIsFullscreen(false);
        setVideoUrl(null);
        // Ensure we return to portrait orientation
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    const handleFullscreenToggle = (isFullscreenActive: boolean) => {
        setIsFullscreen(isFullscreenActive);
        if (!isFullscreenActive) {
            setVideoUrl(null);
        }
    };

    return (
        <VideoPlayerContext.Provider value={{
            showFullscreenVideo,
            hideFullscreenVideo,
            isFullscreen,
        }}>
            {children}
            {videoUrl && (
                <View style={[
                    styles.fullscreenContainer,
                    !isFullscreen && styles.hidden
                ]}>
                    <VideoPlayer
                        videoSource={videoUrl}
                        isFullscreenMode={isFullscreen}
                        onFullscreenToggle={handleFullscreenToggle}
                    />
                </View>
            )}
        </VideoPlayerContext.Provider>
    );
};

const styles = StyleSheet.create({
    fullscreenContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999999,
        elevation: 999999,
    },
    hidden: {
        display: 'none',
    },
}); 