import React from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {useRouter} from "expo-router";

const { width, height } = Dimensions.get('window');

const Welcome = () => {
    const router = useRouter();

    return (
        <ImageBackground
            source={require('../../assets/images/welcome/bg-welcome-app.png')}
            resizeMode="cover"
            style={{ width: '100%', height: '100%', position: 'relative' }}
        >
            {/* Floating Images */}
            <Image
                source={require('../../assets/images/welcome/Ellipse1copy.png')}
                style={{
                    position: 'absolute',
                    right: -56,
                    top: -56,
                    width: 150,
                    height: 150,
                }}
            />
            <Image
                source={require('../../assets/images/welcome/Ellipse1.png')}
                style={{
                    position: 'absolute',
                    left: -16,
                    bottom: -16,
                    width: 150,
                    height: 150,
                }}
            />
            <Image
                source={require('../../assets/images/welcome/gcap.png')}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: height * 0.65,
                    width: 70,
                    height: 70,
                }}
            />

            {/* Content */}
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    gap: 20,
                }}
            >
                <Image
                    source={require('../../assets/images/welcome/welcome-text.png')}
                    style={{ width: 250, height: 60, resizeMode: 'contain' }}
                />
                <Image
                    source={require('../../assets/images/welcome/Logo-shadow.png')}
                    style={{ width: 150, height: 150, resizeMode: 'contain' }}
                />
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#facc15', fontSize: 20, fontWeight: '600' }}>
                        LOVEWORLD
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>
                        FOUNDATION SCHOOL
                    </Text>
                </View>

                {/* Buttons */}
                <View style={{ marginTop: 48, width: '100%', gap: 16 }}>

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/signup')}
                        style={{
                            backgroundColor: '#facc15',
                            paddingVertical: 12,
                            borderRadius: 999,
                            alignItems: 'center',
                            width: 320,
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ color: '#312e81', fontSize: 18, fontWeight: 'bold' }}>
                            Sign-up
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/signin')}
                        style={{
                            backgroundColor: '#fff',
                            paddingVertical: 12,
                            borderRadius: 999,
                            alignItems: 'center',
                            width: 320,
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default Welcome;
