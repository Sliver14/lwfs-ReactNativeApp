// components/cart/CartScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { CartItemComponent } from './CartItem';
import { CartItem } from '../../types';

interface CartScreenProps {
    cartItems: CartItem[];
    onBack: () => void;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemoveItem: (id: number) => void;
    onCheckout: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
                                                          cartItems,
                                                          onBack,
                                                          onUpdateQuantity,
                                                          onRemoveItem,
                                                          onCheckout
                                                      }) => {
    const total = Array.isArray(cartItems)
        ? cartItems.reduce((sum, item) => {
            const priceStr = item.product?.price || '0'; // fallback to '0' if undefined
            const numericPrice = parseFloat(priceStr.replace('Espees', '')) || 0; // fallback to 0 if NaN
            return sum + numericPrice * item.quantity;
        }, 0)
        : 0;
    console.log('Cart items:', cartItems);

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-white p-6 shadow-sm">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={onBack}>
                        <Feather name="arrow-left" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-gray-800">Shopping Cart</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                {cartItems.length === 0 ? (
                    <View className="items-center justify-center py-12">
                        <Feather name="shopping-cart" size={64} color="#D1D5DB" />
                        <Text className="text-xl font-semibold text-gray-500 mt-4 mb-2">Your cart is empty</Text>
                        <Text className="text-gray-400 text-sm">Add some items to get started</Text>
                    </View>
                ) : (
                    <View className="gap-4">
                        {cartItems.map((item) => (
                            <CartItemComponent
                                key={item.id}
                                item={item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemove={onRemoveItem}
                            />
                        ))}

                        <Card className="p-4 mt-6">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-semibold text-gray-800">Total:</Text>
                                <Text className="text-2xl font-bold text-blue-500">{total.toFixed(2)} Espees</Text>
                            </View>
                            <Button onPress={onCheckout}>
                                Proceed to Checkout
                            </Button>
                        </Card>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};