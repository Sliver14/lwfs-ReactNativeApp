// components/cart/CartItem.tsx
import { useUserCart } from '@/contexts/UserCartContext'; // Import useUserCart
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { CartItem as CartItemType } from '../../types';

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

const CartItemComponentInternal: React.FC<CartItemProps> = ({ item }) => {
    const { increaseItemQuantity, decreaseItemQuantity, removeCartItemById } = useUserCart();
    const product = item.product;
    // Removed iconName since it's not in the Prisma schema
    // const IconComponent = getIconComponent(item.iconName);

    const handleIncreaseQuantity = React.useCallback(() => {
        if (product?.id) {
            increaseItemQuantity(product.id);
        }
    }, [product?.id, increaseItemQuantity]);

    const handleDecreaseQuantity = React.useCallback(() => {
        if (product?.id) {
            decreaseItemQuantity(product.id);
        }
    }, [product?.id, decreaseItemQuantity]);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 8, backgroundColor: 'white', gap: 16 }}>
            <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center">
                <Image
                    source={{ uri: product?.imageUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
            </View>
            <View style={{ flex: 1 }}>
                <Text className="font-semibold text-base text-gray-800 mb-1">{product?.name}</Text>
                <Text className="font-bold text-[#453ace] text-sm">{product?.price} Espees</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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
        </View>
    );
};

// Export with React.memo to prevent unnecessary re-renders
export const CartItemComponent = React.memo(CartItemComponentInternal);