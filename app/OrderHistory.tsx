import { useUser } from '@/contexts/UserContext';
import { API_URL } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrderHistoryScreen() {
    const { userDetails } = useUser();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        if (!userDetails?.id) {
            Alert.alert('Error', 'User not found');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/orders`, {
                params: { userId: userDetails.id },
            });
            setOrders(response.data);
        } catch (error) {
            console.log('Fetch orders error:', error);
            Alert.alert('Error', 'Failed to fetch order history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const renderOrderItem = ({ item }: { item: Order }) => (
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800 font-bold">Order #{item.id.slice(0, 8)}</Text>
                <Text className={`text-sm ${
                    item.status === 'pending' ? 'text-yellow-500' :
                        item.status === 'completed' ? 'text-green-500' : 'text-red-500'
                }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
            </View>
            <Text className="text-gray-600">
                Total: ${item.totalAmount.toFixed(2)}
            </Text>
            <Text className="text-gray-600">
                Date: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <View className="mt-2">
                <Text className="text-gray-500 font-semibold mb-1">Items:</Text>
                {item.items.map((orderItem) => (
                    <View key={orderItem.id} className="flex-row justify-between py-1">
                        <Text className="text-gray-700">{orderItem.productName} (x{orderItem.quantity})</Text>
                        <Text className="text-gray-700">${(orderItem.price * orderItem.quantity).toFixed(2)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5F7FA' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
            <View className="flex-row items-center px-4 py-3 bg-[#453ace]">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">Order History</Text>
            </View>
            <View className="flex-1 px-4 pt-4">
                {loading ? (
                    <Text className="text-center text-gray-600">Loading...</Text>
                ) : orders.length === 0 ? (
                    <Text className="text-center text-gray-600 mt-8">No orders found</Text>
                ) : (
                    <FlatList
                        data={orders}
                        renderItem={renderOrderItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}