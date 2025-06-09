// components/shared/InputField.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputFieldProps extends TextInputProps {
    label?: string;
    placeholder?: string;
    icon?: string;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
                                                          label,
                                                          placeholder,
                                                          icon,
                                                          secureTextEntry = false,
                                                          showPasswordToggle = false,
                                                          showPassword = false,
                                                          onTogglePassword,
                                                          value,
                                                          onChangeText,
                                                          ...props
                                                      }) => (
    <View className="mb-4">
        {label && <Text className="text-gray-700 mb-2 font-medium">{label}</Text>}
        <View className="relative flex-row items-center">
            {icon && (
                <Feather
                    name={icon as any}
                    size={20}
                    color="#9CA3AF"
                    className="absolute left-3 z-10"
                />
            )}
            <TextInput
                className={`flex-1 px-4 py-3 border border-gray-300 rounded-xl text-base bg-white ${
                    icon ? 'pl-11' : ''
                }`}
                placeholder={placeholder}
                secureTextEntry={showPasswordToggle ? !showPassword : secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#9CA3AF"
                {...props}
            />
            {showPasswordToggle && (
                <TouchableOpacity onPress={onTogglePassword} className="absolute right-3 z-10">
                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
            )}
        </View>
    </View>
);