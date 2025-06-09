// components/shared/BackButton.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BackButtonProps {
    onPress: () => void;
    text?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, text = "Back" }) => (
    <TouchableOpacity className="flex-row items-center mb-4" onPress={onPress}>
        <Feather name="arrow-left" size={16} color="#fff" />
        <Text className="text-white ml-1">{text}</Text>
    </TouchableOpacity>
);