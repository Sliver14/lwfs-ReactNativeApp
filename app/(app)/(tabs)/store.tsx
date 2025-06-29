// App.tsx
import { CartScreen } from '@/components/cart/CartScreen';
import { ProductDetail } from '@/components/products/ProductDetail';
import { ProductCard } from '@/components/store/ProductCard';
import { StoreHeader } from '@/components/store/StoreHeader';
import { StoreSearch } from '@/components/store/StoreSearch';
import { useUserCart } from '@/contexts/UserCartContext';
import { useUser } from '@/contexts/UserContext';
import { API_URL } from '@/utils/env';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Product, ViewType } from './types';


// Loading Component
const LoadingProductCard: React.FC = () => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const pulse = () => {
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start(() => pulse());
        };
        pulse();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View style={{ opacity }} className="w-[48%] bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <View className="h-32 mb-[55px] bg-gray-200" />
            <View className="p-3">
                <View className="h-4 bg-gray-200 rounded mb-2" />
                <View className="h-3 bg-gray-200 rounded mb-3 w-3/4" />
                <View className="flex-row justify-between items-center">
                    <View className="h-4 bg-gray-200 rounded w-16" />
                    <View className="h-6 bg-gray-200 rounded w-12" />
                </View>
            </View>
        </Animated.View>
    );
};

const LoadingScreen: React.FC = () => {
    return (
        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            {/* Loading Header */}
            <View className="mb-6">
                <View className="h-8 bg-gray-200 rounded w-32 mb-4" />
                <View className="flex-row justify-between items-center mb-6">
                    <View className="h-6 bg-gray-200 rounded w-24" />
                    <View className="flex-row">
                        <View className="h-10 w-10 bg-gray-200 rounded-full mr-3" />
                        <View className="h-10 w-10 bg-gray-200 rounded-full" />
                    </View>
                </View>
            </View>

            {/* Loading Product Cards */}
            <View className="flex-row flex-wrap justify-between">
                {Array.from({ length: 6 }, (_, index) => (
                    <LoadingProductCard key={index} />
                ))}
            </View>

            {/* Loading Indicator with Text */}
            <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 mt-3 text-base font-medium">
                    Loading Products...
                </Text>
                <Text className="text-gray-400 mt-1 text-sm">
                    Please wait while we fetch the latest items
                </Text>
            </View>
        </ScrollView>
    );
};

const ErrorScreen: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
    return (
        <View className="flex-1 items-center justify-center p-6">
            <View className="bg-red-50 p-6 rounded-xl items-center">
                <Text className="text-red-600 text-lg font-semibold mb-2">
                    Oops! Something went wrong
                </Text>
                <Text className="text-red-500 text-center mb-4">
                    We couldn't load the products. Please check your connection and try again.
                </Text>
                <TouchableOpacity
                    className="bg-red-500 px-6 py-3 rounded-lg"
                    onPress={onRetry}
                >
                    <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const EnhancedStoreApp: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewType>('store');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    // const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const { cart } = useUserCart();
    // console.log("Cart List for User: ", cart.cartItems);
    // const { fetchUserCart } = useUserCart();
    const { userId, userDetails } = useUser();
    const router = useRouter();
    const LineSeparator = () => (
    <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />
    );

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/store/products`);
            setProducts(response.data);
            // console.log('Products loaded:', response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (cart) {
    //         setCartItems(cart);
    //     }
    // }, [cart]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const totalCartPrice:number =
        cart?.cartItems?.reduce((acc, item) => {
        return acc + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;

    const narration: string = cart?.cartItems?.map(item => {
        const name = item.product?.name || "Item";
        const qty = item.quantity || 0;
        return `${qty}x ${name}`;
        }).join(", ") || "";


    const onCheckout = async () => {
        console.log(totalCartPrice)
        console.log(narration)
        setLoading2(true);

        if (totalCartPrice > 0) {
            try{
                const success_url = "lwfsapp://payment-success";
                // const success_url = "https://lwfs-homepage.vercel.app";
                // const fail_url = "https://lwfs-homepage.vercel.app/login";
                const fail_url = "lwfsapp://payment-failed";

            const response = await axios.post(`${API_URL}/cart/checkout`, {
                narration,
                price: totalCartPrice,
                success_url,
                fail_url,
                "user_data": {
                "userId": userId,
                "firstName": userDetails?.firstName,
                "lastName": userDetails?.lastName,
                }
            }

        );
            const paymentRef: string = response.data.payment_ref;
            console.log("paymentRef:", paymentRef)
            // localStorage.setItem(paymentRef, paymentRef)
            if (paymentRef){
                await WebBrowser.openBrowserAsync(`https://payment.espees.org/pay/${paymentRef}`)
            }

        }catch(error){
           if (axios.isAxiosError(error)) {
                console.log("Status:", error.response?.status);
                console.log("Message:", error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
        }finally{
            setLoading2(false);
        }
        }

    }

    const { addToCart } = useUserCart();
    const { fetchUserCart } = useUserCart();

    const updateCartQuantity = async (id: number, newQuantity: number) => {
        try {
            if (newQuantity <= 0) {
                await axios.patch(`${API_URL}/cart/decrease`, {
                    data: { productId: id },
                });
            } else {
                await axios.patch(`${API_URL}/cart/increase`, {
                    userId,
                    productId: id,
                    quantity: newQuantity,
                });
            }

            await fetchUserCart(); // Refresh cart from DB
        } catch (error) {
            console.error('Failed to update cart quantity:', error);
        }
    };


    const cartCount = Array.isArray(cart.cartItems)
        ? cart.cartItems.reduce((sum, item) => sum + item.quantity, 0)
        : 0;


    const renderCurrentView = () => {
        // Show loading screen when fetching products
        if (loading && currentView === 'store') {
            return <LoadingScreen />;
        }

        // Show error screen when there's an error
        if (error && currentView === 'store') {
            return <ErrorScreen onRetry={fetchProducts} />;
        }
        switch (currentView) {

            case 'store':
                return (
                    <SafeAreaView className="flex-1 p-6 mb-[95px]" showsVerticalScrollIndicator={false}>
                        <StoreHeader
                            cartCount={cartCount}
                            onSearchPress={() => setCurrentView('search')}
                            onCartPress={() => setCurrentView('cart')}
                        />
                         <ScrollView className="" showsVerticalScrollIndicator={false}>

                        <View className='flex bg-[#453ace] rounded-xl shadow-slate-600 h-48 mb-8 p-6 gap-4 justify-center'>
                            <Text className='text-white font-bold text-2xl'>Graduation Sale!</Text>
                            <Text className='color-white'>Get up to 20% off on selected items</Text>
                            <TouchableOpacity className='bg-white w-32 px-4 py-2 rounded-lg'>
                                <Text className='text-[#453ace] '>Shop Now</Text>
                            </TouchableOpacity>
                        </View>

                        {products.length === 0 ? (
                            <View className="items-center justify-center py-12">
                                <Text className="text-gray-500 text-lg font-medium">
                                    No products available
                                </Text>
                                <Text className="text-gray-400 mt-2">
                                    Check back later for new items
                                </Text>
                            </View>
                        ) : (
                            <View className='flex-row flex-wrap gap-4'>
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onPress={() => {
                                            setSelectedProduct(product);
                                            setCurrentView('productDetail');
                                        }}
                                        onAddToCart={addToCart}
                                    />
                                ))}
                            </View>
                        )}
                    </ScrollView>
                    </SafeAreaView>

                );

            case 'search':
                const filteredProducts = products.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                    <View className="flex-1 bg-gray-50">
                        <StoreSearch
                            onBack={() => setCurrentView('store')}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                            {filteredProducts.length === 0 ? (
                                <View className="items-center justify-center py-12">
                                    <Text className="text-gray-500 text-lg font-medium">
                                        {searchQuery ? 'No products found' : 'Start typing to search'}
                                    </Text>
                                    {searchQuery && (
                                        <Text className="text-gray-400 mt-2">
                                            Try different keywords
                                        </Text>
                                    )}
                                </View>
                            ) : (
                                <View className="flex-row flex-wrap justify-between gap-4">
                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onPress={() => {
                                                setSelectedProduct(product);
                                                setCurrentView('productDetail');
                                            }}
                                            onAddToCart={addToCart}
                                        />
                                    ))}
                                </View>
                            )}
                        </ScrollView>
                    </View>
                );

            case 'productDetail':
                return selectedProduct ? (
                    <ProductDetail
                        product={selectedProduct}
                        onBack={() => setCurrentView('store')}
                        onAddToCart={addToCart}
                        cartCount={cartCount}
                    />

                ) : null;

            case 'cart':
                return (
                    <CartScreen
                        cartItems={cart.cartItems || []}
                        onBack={() => setCurrentView('store')}
                        onUpdateQuantity={updateCartQuantity}
                        onRemoveItem={(id) => updateCartQuantity(id, 0)}
                        onCheckout={onCheckout}
                        loading={loading2}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 mb-45">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {renderCurrentView()}
        </SafeAreaView>
    );
};

export default EnhancedStoreApp;