// / components/shared/Badge.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className }) => (
    <View className={`bg-red-500 rounded-full min-w-5 h-5 items-center justify-center px-1.5 ${className || ''}`}>
        <Text className="text-white text-xs font-bold">{children}</Text>
    </View>
);