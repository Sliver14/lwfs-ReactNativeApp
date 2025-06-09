// components/store/StoreSearch.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { InputField } from '../shared/InputField';

interface StoreSearchProps {
    onBack: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const StoreSearch: React.FC<StoreSearchProps> = ({
                                                            onBack,
                                                            searchQuery,
                                                            onSearchChange
                                                        }) => (
    <View className="p-6">
        <View className="flex-row items-center mb-6 gap-4">
            <TouchableOpacity onPress={onBack} className="p-2">
                <Feather name="arrow-left" size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1">
                <InputField
                    placeholder="Search products..."
                    icon="search"
                    value={searchQuery}
                    onChangeText={onSearchChange}
                />
            </View>
            <TouchableOpacity className="p-2">
                <Feather name="filter" size={20} color="#6B7280" />
            </TouchableOpacity>
        </View>
        {searchQuery && (
            <Text className="text-gray-500 mb-4">
                Showing results for "{searchQuery}"
            </Text>
        )}
    </View>
);