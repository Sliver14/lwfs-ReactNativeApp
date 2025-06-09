// components/cart/CartItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Card } from '../shared/Card';
import { CartItem as CartItemType } from '../../types';
import {Image} from "react-native";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
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

export const CartItemComponent: React.FC<CartItemProps> = ({
                                                               item,
                                                               onUpdateQuantity,
                                                               onRemove
                                                           }) => {
    const product = item.product;
    const IconComponent = getIconComponent(item.iconName);
    console.log(item)

    return (
        <Card className="flex-row items-center p-4 gap-4">
            <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center">
                <Image
                    source={{ uri: product?.imageUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />

            </View>
            <View className="flex-1">
                <Text className="font-semibold text-base text-gray-800 mb-1">{product?.name}</Text>
                {/*<Text className="text-gray-500 text-xs mb-1">{item.description}</Text>*/}
                <Text className="font-bold text-blue-500 text-sm">{product.price}</Text>
            </View>
            <View className="flex-row items-center gap-2">
                <TouchableOpacity
                    className="p-1 bg-gray-100 rounded-full w-8 h-8 items-center justify-center"
                    onPress={() => onUpdateQuantity(item.id, product.quantity - 1)}
                >
                    <Feather name="minus" size={16} color="#6B7280" />
                </TouchableOpacity>
                <Text className="font-medium text-base min-w-8 text-center">{item?.quantity}</Text>
                <TouchableOpacity
                    className="p-1 bg-gray-100 rounded-full w-8 h-8 items-center justify-center"
                    onPress={() => onUpdateQuantity(product.id, product.quantity + 1)}
                >
                    <Feather name="plus" size={16} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </Card>
    );
};