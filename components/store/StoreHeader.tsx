// components/store/StoreHeader.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
}) => {

  const LineSeparator = () => (
    <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 10 }} className='opacity-50' />
  );

  return (
    <View className='mb-2'>
      <View className="flex-row justify-between items-center ">
        <View>
          <Text className="text-2xl font-bold text-gray-800">Store</Text>
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

      {/* ✅ Add separator after the header block */}
      <LineSeparator />
    </View>
  );
};
