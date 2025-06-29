// components/cart/CartItem.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { CartItem as CartItemType } from '../../types';
import { Card } from '../shared/Card';
import { useUserCart } from '@/contexts/UserCartContext'; // Import useUserCart

interface CartItemProps {
    item: CartItemType;
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

export const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
    const { increaseItemQuantity, decreaseItemQuantity, removeCartItemById } = useUserCart();
    const product = item.product;
    const IconComponent = getIconComponent(item.iconName);

    const handleIncreaseQuantity = () => {
        if (product?.id) {
            increaseItemQuantity(product.id);
        }
    };

    const handleDecreaseQuantity = () => {
        if (product?.id) {
            decreaseItemQuantity(product.id);
            // Only decrease if quantity is greater than 1, otherwise remove the item
            // if (item.quantity > 1) {
            //     decreaseItemQuantity(product.id);
            // } else {
            //     // If quantity is 1 and decreased, remove the item entirely
            //     removeCartItemById(item.id);
            // }
        }
    };

    return (
        <Card className="flex-row items-center p-4 gap-4" style={{ marginBottom: 8 }}>
            <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center">
                <Image
                    source={{ uri: product?.imageUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
            </View>
            <View className="flex-1">
                <Text className="font-semibold text-base text-gray-800 mb-1">{product?.name}</Text>
                <Text className="font-bold text-[#453ace] text-sm">{product?.price} Espees</Text>
            </View>
            <View className="flex-row items-center gap-2">
                <TouchableOpacity
                    className="p-1 bg-gray-100 rounded-full w-8 h-8 items-center justify-center"
                    onPress={handleDecreaseQuantity}
                >
                    <Feather name="minus" size={16} color="#6B7280" />
                </TouchableOpacity>
                <Text className="font-medium text-base min-w-8 text-center">{item?.quantity}</Text>
                <TouchableOpacity
                    className="p-1 bg-gray-100 rounded-full w-8 h-8 items-center justify-center"
                    onPress={handleIncreaseQuantity}
                >
                    <Feather name="plus" size={16} color="#6B7280" />
                </TouchableOpacity>
            </View>
            {/* The trash icon is removed from here as it's now part of the swipe action */}
        </Card>
    );
};