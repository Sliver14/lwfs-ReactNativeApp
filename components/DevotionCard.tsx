// DevotionCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const DevotionCard: React.FC = () => (
    <View style={{
        backgroundColor: '#453ace',
        padding: 24,
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8
    }}>
        {/* Gradient effect can be achieved with libraries like react-native-linear-gradient */}
        <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 8
        }}>
            Loveworld Foundation School
        </Text>
        <Text style={{
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: 16,
            fontSize: 13
        }}>
            Preparing the Saints for Ministry...
        </Text>
        {/*<TouchableOpacity style={{*/}
        {/*    backgroundColor: 'rgba(255, 255, 255, 0.2)',*/}
        {/*    paddingHorizontal: 16,*/}
        {/*    paddingVertical: 8,*/}
        {/*    borderRadius: 8,*/}
        {/*    alignSelf: 'flex-start'*/}
        {/*}}>*/}
        {/*    <Text style={{*/}
        {/*        color: 'white',*/}
        {/*        fontWeight: '500'*/}
        {/*    }}>*/}
        {/*        Read More*/}
        {/*    </Text>*/}
        {/*</TouchableOpacity>*/}
    </View>
);

export default DevotionCard;