import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface StoreSearchProps {
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const StoreSearch: React.FC<StoreSearchProps> = ({ onBack, searchQuery, onSearchChange }) => (
  <View className="p-4">
    <View className="flex-row items-center space-x-2">
      <TouchableOpacity onPress={onBack} className="p-2">
        <Feather name="arrow-left" size={24} color="#4B5563" />
      </TouchableOpacity>
      <View className="flex-1 relative">
        <Feather name="search" size={20} color="#9CA3AF" className="absolute left-3 top-1/2 -translate-y-1/2" />
        <TextInput
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={onSearchChange}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-800"
          placeholderTextColor="#9CA3AF"
          autoFocus
        />
      </View>
      <TouchableOpacity className="p-2">
        <Feather name="filter" size={24} color="#4B5563" />
      </TouchableOpacity>
    </View>
    {searchQuery && <Text className="text-gray-500 mt-2">Showing results for "{searchQuery}"</Text>}
  </View>
);