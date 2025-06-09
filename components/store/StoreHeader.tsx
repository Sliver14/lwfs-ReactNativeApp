// components/store/StoreHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Badge } from '../shared/Badge';

interface StoreHeaderProps {
    cartCount: number;
    onSearchPress: () => void;
    onCartPress: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
                                                            cartCount,
                                                            onSearchPress,
                                                            onCartPress
                                                        }) => (
    <View className="flex-row justify-between items-center mb-6">
        <View>
            <Text className="text-2xl font-bold text-gray-800">Store</Text>
            {/*<Text className="text-gray-500 text-sm mt-0.5">Books, resources, and gifts</Text>*/}
        </View>
        <View className="flex-row gap-2">
            <TouchableOpacity
                className="p-3 bg-white rounded-full shadow-sm relative"
                onPress={onSearchPress}
            >
                <Feather name="search" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
                className="p-3 bg-white rounded-full shadow-sm relative"
                onPress={onCartPress}
            >
                <Feather name="shopping-cart" size={20} color="#6B7280" />
                {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1">
                        {cartCount}
                    </Badge>
                )}
            </TouchableOpacity>
        </View>
    </View>
);