// components/shared/Card.tsx
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, onPress, className }) => {
    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            className={`bg-white rounded-xl shadow-sm ${className || ''}`}
            onPress={onPress}
            activeOpacity={onPress ? 0.8 : 1}
        >
            {children}
        </Component>
    );
};