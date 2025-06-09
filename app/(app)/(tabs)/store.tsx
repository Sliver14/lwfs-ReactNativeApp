// App.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, ScrollView, View, Text, ActivityIndicator, Animated } from 'react-native';
import { StoreHeader } from '@/components/store/StoreHeader';
import { ProductCard } from '@/components/store/ProductCard';
import { StoreSearch } from '@/components/store/StoreSearch';
import { ProductDetail } from '@/components/products/ProductDetail';
import { CartScreen } from '@/components/cart/CartScreen';
import { Product, CartItem, ViewType } from './types';
import { useUserCart } from '@/contexts/UserCartContext'
import { useUser } from '@/contexts/UserContext'
import axios from 'axios';
import { API_URL } from '@/utils/env';


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
    const [error, setError] = useState<string | null>(null);
    const { cart } = useUserCart();
    const { fetchCart } = useUserCart();
    const { userId } = useUser();
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/products/productlist`);
            setProducts(response.data.data);
            // console.log('Products loaded:', response.data.data);
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



    const addToCart = async (product: Product) => {
        try {
            const response = await axios.post(`${API_URL}/cart/add`, {
                userId,
                productId: product.id,
                quantity: 1,
            });

            if (response.status === 200) {
                await fetchCart(); // Refresh context and trigger useEffect that updates cartItems
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const updateCartQuantity = async (id: number, newQuantity: number) => {
        try {
            if (newQuantity <= 0) {
                await axios.delete(`${API_URL}/cart/remove`, {
                    data: { productId: id },
                });
            } else {
                await axios.put(`${API_URL}/cart/add`, {
                    userId,
                    productId: id,
                    quantity: newQuantity,
                });
            }

            await fetchCart(); // Refresh cart from DB
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
                    <ScrollView className="flex-1 p-6 mb-[95px]" showsVerticalScrollIndicator={false}>
                        <StoreHeader
                            cartCount={cartCount}
                            onSearchPress={() => setCurrentView('search')}
                            onCartPress={() => setCurrentView('cart')}
                        />
                        {/*<StoreAdvert/>*/}

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
                            <View className="flex-row flex-wrap justify-between gap-4">
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
                        onCheckout={() => setCurrentView('store')} // Simplified for demo
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