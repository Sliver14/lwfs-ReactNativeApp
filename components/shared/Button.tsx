// components/shared/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  onPress,
                                                  variant = 'primary',
                                                  disabled = false,
                                                  className,
                                                  ...props
                                              }) => {
    const baseClasses = "py-4 rounded-xl items-center mt-2";
    const variantClasses = variant === 'primary'
        ? "bg-blue-500"
        : "border-2 border-gray-300 bg-white";
    const disabledClasses = disabled ? "opacity-50" : "";

    return (
        <TouchableOpacity
            className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className || ''}`}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
            {...props}
        >
            <Text className={variant === 'primary' ? "text-white text-lg font-semibold" : "text-gray-700 text-base font-medium"}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};