// components/cart/CartScreen.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { Card } from '../shared/Card';
import { CartItemComponent } from './CartItem';
import { useUserCart } from '@/contexts/UserCartContext';
import { SwipeListView } from 'react-native-swipe-list-view';

interface CartScreenProps {
    onBack: () => void;
    onCheckout: () => void;
    loading: boolean;
}

export const CartScreen: React.FC<CartScreenProps> = ({
                                                          onBack,
                                                          onCheckout,
                                                          loading
                                                      }) => {
    const { cart, removeCartItemById } = useUserCart();

    // --- FIX IS HERE ---
    // Ensure cartItems is always an array, even if 'cart' or 'cart.cartItems' is undefined.
    const cartItems = cart?.cartItems || [];
    // --- END FIX ---

    const total = Array.isArray(cartItems)
        ? cartItems.reduce((sum, item) => {
            const priceStr = item.product?.price || '0';
            const numericPrice = parseFloat(String(priceStr).replace('Espees', '')) || 0;
            return sum + numericPrice * item.quantity;
        }, 0)
        : 0;

    // --- SwipeListView Helpers ---

    const closeRow = (rowMap: any, rowKey: string) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap: any, rowKey: string) => {
        closeRow(rowMap, rowKey);
        removeCartItemById(parseInt(rowKey));
    };

    const renderHiddenItem = (data: any, rowMap: any) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.id.toString())}
            >
                <Feather name="trash-2" size={25} color="white" />
            </TouchableOpacity>
        </View>
    );

    // --- End SwipeListView Helpers ---

    return (
        <View className="flex-1 bg-gray-50 pb-[85px]">
            <View className="bg-white p-6 shadow-sm">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={onBack}>
                        <Feather name="arrow-left" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-gray-800">Shopping Cart</Text>
                </View>
            </View>

            {/* Now, cartItems.length is safe to access because cartItems is guaranteed to be an array */}
            {cartItems.length === 0 ? (
                <View className="items-center justify-center py-12">
                    <Feather name="shopping-cart" size={64} color="#D1D5DB" />
                    <Text className="text-xl font-semibold text-gray-500 mt-4 mb-2">Your cart is empty</Text>
                    <Text className="text-gray-400 text-sm">Add some items to get started</Text>
                </View>
            ) : (
                <View className="flex-1">
                    <SwipeListView
                        data={cartItems} // `data` is now guaranteed to be an array
                        renderItem={({ item }) => <CartItemComponent item={item} />}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-75}
                        // Safely access previewRowKey only if cartItems has elements
                        previewRowKey={cartItems.length > 0 ? cartItems[0].id.toString() : undefined}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                        keyExtractor={(item) => item.id.toString()}
                        disableRightSwipe={true}
                        contentContainerStyle={{ padding: 16 }}
                    />

                    <Card className="p-4 mt-6 mx-4 mb-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold text-gray-800">Total:</Text>
                            <Text className="text-2xl font-bold text-[#453ace]">{total.toFixed(2)} Espees</Text>
                        </View>
                        <TouchableOpacity className='flex justify-center rounded-xl my-6 bg-[#453ace] items-center p-6' onPress={onCheckout}>
                            <Text className={`text-white ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                                {loading ? "Proceeding to checkout" : "Proceed to Checkout"}
                            </Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        borderRadius: 8,
        marginVertical: 4,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#FF6347',
        right: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
});