import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface StoreHeaderProps {
  cartCount: number;
  onSearchPress: () => void;
  onCartPress: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ cartCount, onSearchPress, onCartPress }) => {
  return (
    <View className="flex w-full flex-row items-center space-x-2 mb-4">
      <View className="flex-1 relative">
        <Feather
          name="search"
          size={20}
          color="#9CA3AF"
          style={{ position: 'absolute', left: 12, top: '50%', transform: [{ translateY: -10 }] }}
        />
        <TextInput
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={onSearchPress}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      <TouchableOpacity className="relative" onPress={onCartPress}>
        <Feather name="shopping-cart" size={28} color="#4B5563" />
        {cartCount > 0 && (
          <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
            <Text className="text-white text-xs font-bold">{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};