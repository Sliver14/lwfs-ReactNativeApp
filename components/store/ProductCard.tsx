// components/store/ProductCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Card } from '../shared/Card';
import { Product } from '../../types';
import {Image} from "react-native";

interface ProductCardProps {
    product: Product;
    onPress: () => void;
    onAddToCart: (product: Product) => void;
}

const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
        'book': Feather,
        'cross': MaterialIcons,
        'book-open': Feather,
        'heart': Feather,
    };
    return iconMap[iconName] || Feather;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onAddToCart }) => {
    const IconComponent = getIconComponent(product.iconName);

    return (
        <Card onPress={onPress} className="w-[48%] mb-4 overflow-hidden">
            <View className="h-52 bg-gray-100 items-center justify-center">
                <Image
                    source={{ uri: product.imageUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
            </View>
            <View className="p-3">
                <Text className="font-semibold text-sm mb-1 text-gray-800" numberOfLines={2}>
                    {product.name}
                </Text>
                {/*<Text className="text-gray-500 text-xs mb-2" numberOfLines={2}>*/}
                {/*    {product.description}*/}
                {/*</Text>*/}
                <View className="flex-row justify-between items-center">
                    <Text className="font-bold text-blue-500 text-sm">{product.price} Espees</Text>
                    <TouchableOpacity
                        className="bg-blue-500 px-3 py-1 rounded-lg"
                        onPress={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                    >
                        <Text className="text-white text-xs font-medium">Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );
};