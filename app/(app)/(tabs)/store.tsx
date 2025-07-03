import { CartScreen } from '@/components/cart/CartScreen';
import { ProductDetail } from '@/components/products/ProductDetail';
import { ProductCard } from '@/components/store/ProductCard';
import { StoreSearch } from '@/components/store/StoreSearch';
import { useUserCart } from '@/contexts/UserCartContext';
import { useUser } from '@/contexts/UserContext';
import { API_URL } from '@/utils/env';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Get screen width for carousel
const { width: screenWidth } = Dimensions.get('window');

// Define Product type locally since types file is missing
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
}

type ViewType = 'store' | 'search' | 'productDetail' | 'cart';

// Mock data for featured product
const featuredProduct = {
  name: 'Graduation Gown',
  originalPrice: 99.99,
  discountedPrice: 59.99,
  discount: '15% OFF',
};

// Enhanced Store Header Component
const EnhancedStoreHeader: React.FC<{
  cartCount: number;
  onSearchPress: () => void;
  onCartPress: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  showSearch?: boolean;
}> = ({ cartCount, onSearchPress, onCartPress, searchQuery, onSearchChange, showSearch = false }) => {
  return (
    <View className="flex-row items-center space-x-2 mb-4">
      <View className="flex-1 relative">
        <Feather
          name="search"
          size={20}
          color="#657786"
          style={{ position: 'absolute', left: 12, top: '50%', transform: [{ translateY: -10 }], zIndex: 1 }}
        />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800"
          onFocus={onSearchPress}
          placeholderTextColor="#657786"
          editable={true}
          style={{
            backgroundColor: '#F5F7FA',
            borderRadius: 20,
            fontWeight: '400'
          }}
        />
      </View>
      <TouchableOpacity className="relative p-2" onPress={onCartPress}>
        <Feather name="shopping-cart" size={24} color="#657786" />
        {cartCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-white text-xs font-bold" style={{ fontWeight: '700' }}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Category Pills Component
const CategoryPills: React.FC<{
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <View className="mb-4">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row space-x-3"
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category}
            className={`px-4 py-2 rounded-full ${
              activeCategory === category || (index === 0 && activeCategory === 'All')
                ? 'bg-blue-500' 
                : 'bg-gray-100'
            }`}
            onPress={() => onCategoryChange(category)}
            style={{
              borderRadius: 20,
              backgroundColor: activeCategory === category || (index === 0 && activeCategory === 'All') 
                ? '#4A90E2' 
                : '#F5F7FA',
              borderWidth: activeCategory === category || (index === 0 && activeCategory === 'All') ? 0 : 1,
              borderColor: '#E1E8ED'
            }}
          >
            <Text 
              className={`text-sm font-medium whitespace-nowrap ${
                activeCategory === category || (index === 0 && activeCategory === 'All')
                  ? 'text-white' 
                  : 'text-gray-600'
              }`}
              style={{ 
                fontWeight: activeCategory === category || (index === 0 && activeCategory === 'All') ? '600' : '500'
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Auto-scrolling Promotion Carousel Component
const AutoScrollingPromotionFlyer: React.FC<{
  onBuyNow: (promotion: any) => void;
}> = ({ onBuyNow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const promotions = [
    {
      id: 1,
      title: 'Graduation Season',
      subtitle: 'Graduation Gown - Special Offer',
      price: '$59.99',
      originalPrice: '$99.99',
      buttonText: 'Buy Now',
      colors: ['#4A90E2', '#7B68EE'] as [string, string],
      productName: 'Graduation Gown'
    },
    {
      id: 2,
      title: 'Summer Collection',
      subtitle: 'New Arrivals - Up to 40% Off',
      price: 'From $29.99',
      originalPrice: '',
      buttonText: 'Shop Now',
      colors: ['#FF8C42', '#FFD93D'] as [string, string],
      productName: 'Summer Collection'
    },
    {
      id: 3,
      title: 'Back to School',
      subtitle: 'School Supplies & Uniforms',
      price: 'From $19.99',
      originalPrice: '',
      buttonText: 'Explore',
      colors: ['#4CAF50', '#8BC34A'] as [string, string],
      productName: 'School Supplies'
    },
    {
      id: 4,
      title: 'Holiday Special',
      subtitle: 'Festive Collection - Limited Time',
      price: 'From $39.99',
      originalPrice: '$79.99',
      buttonText: 'Get Offer',
      colors: ['#9C27B0', '#7B68EE'] as [string, string],
      productName: 'Holiday Collection'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % promotions.length;
        // Auto-scroll to the next card with fade transition
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true
        });
        return nextIndex;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View className="flex mb-4 justify-center w-full">
      <View className="relative">
        <Animated.View style={{ opacity: fadeAnim }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="h-40"
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {promotions.map((promotion, index) => (
              <View key={promotion.id} style={{ width: screenWidth, alignItems: 'center' }}>
                <LinearGradient
                  colors={promotion.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="p-6 h-full"
                  style={{
                    borderRadius: 16,
                    paddingHorizontal: 20,
                    paddingVertical: 24,
                    marginHorizontal: 16,
                    shadowColor: promotion.colors[0],
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 8,
                    width: screenWidth - 32,
                    alignSelf: 'center',
                  }}
                >
                  <Text className="text-base font-bold text-white mb-2" style={{ fontWeight: '700' }}>{promotion.title}</Text>
                  <Text className="text-white mb-4 text-sm" style={{ fontWeight: '400', opacity: 0.9 }}>{promotion.subtitle}</Text>
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-xl font-bold text-white" style={{ fontWeight: '700' }}>{promotion.price}</Text>
                      {promotion.originalPrice && (
                        <Text className="text-white line-through ml-2 text-sm" style={{ fontWeight: '400', opacity: 0.7 }}>{promotion.originalPrice}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      className="bg-white px-4 py-2 rounded-full"
                      onPress={() => onBuyNow(promotion)}
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3
                      }}
                    >
                      <Text className="text-orange-500 font-semibold" style={{ fontWeight: '600' }}>{promotion.buttonText}</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
};

// Product Grid Component
const ProductGrid: React.FC<{
  products: Product[];
  onProductPress: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  loading: boolean;
}> = ({ products, onProductPress, onAddToCart, loading }) => {
  const LoadingCard = () => {
    const pulse = () => {
      const pulseAnim = new Animated.Value(1);
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      return pulseAnim;
    };

    return (
      <View className="w-[48%] mb-4">
        <Animated.View
          className="bg-white rounded-xl p-4"
          style={{
            opacity: pulse(),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#E1E8ED'
          }}
        >
          <View className="w-full h-32 bg-gray-200 rounded-lg mb-3" />
          <View className="space-y-2">
            <View className="h-4 bg-gray-200 rounded" />
            <View className="h-3 bg-gray-200 rounded w-3/4" />
            <View className="h-3 bg-gray-200 rounded w-1/2" />
          </View>
        </Animated.View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-row flex-wrap justify-between">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap justify-between">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onPress={() => onProductPress(product)}
          onAddToCart={onAddToCart}
        />
      ))}
    </View>
  );
};

// Error Screen Component
const ErrorScreen: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: '#F5F7FA' }}>
      <Feather name="alert-triangle" size={60} color="#F44336" />
      <Text className="text-lg font-semibold mt-4 text-gray-800" style={{ fontWeight: '600' }}>
        Something went wrong
      </Text>
      <Text className="text-gray-500 text-center mt-2 px-8" style={{ fontWeight: '400' }}>
        We couldn't load the products. Please try again.
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        className="mt-6 px-6 py-3 rounded-full"
        style={{
          backgroundColor: '#4A90E2',
          shadowColor: '#4A90E2',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6
        }}
      >
        <Text className="text-white font-semibold" style={{ fontWeight: '600' }}>Retry</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Search Results Component
const SearchResults: React.FC<{
  products: Product[];
  searchQuery: string;
  onProductPress: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  onSearchChange: (text: string) => void;
}> = ({ products, searchQuery, onProductPress, onAddToCart, onBack, onSearchChange }) => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5F7FA' }}>
      <StoreSearch
        onBack={onBack}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {searchQuery && (
          <Text className="text-gray-500 text-sm mb-4" style={{ fontWeight: '500' }}>
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </Text>
        )}
        {products.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Feather name="search" size={48} color="#657786" />
            <Text className="text-gray-500 text-lg font-medium mt-4" style={{ fontWeight: '500' }}>
              {searchQuery ? 'No products found' : 'Start typing to search'}
            </Text>
            {searchQuery && <Text className="text-gray-400 mt-2" style={{ fontWeight: '400' }}>Try different keywords</Text>}
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => onProductPress(product)}
                onAddToCart={onAddToCart}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Main Enhanced Store App
const EnhancedStoreApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const { cart, addToCart, fetchUserCart } = useUserCart();
  const { userId, userDetails } = useUser();
  const router = useRouter();

  const categories = ['All', 'Pastors', 'Principals', 'Teachers', 'Students'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/store/products`);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalCartPrice: number =
    cart?.cartItems?.reduce((acc, item) => {
      return acc + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;

  const narration: string =
    cart?.cartItems
      ?.map((item) => {
        const name = item.product?.name || 'Item';
        const qty = item.quantity || 0;
        return `${qty}x ${name}`;
      })
      .join(', ') || '';

  const onCheckout = async () => {
    setLoading2(true);
    if (totalCartPrice > 0) {
      try {
        const success_url = 'lwfsapp://payment-success';
        const fail_url = 'lwfsapp://payment-failed';
        const response = await axios.post(`${API_URL}/cart/checkout`, {
          narration,
          price: totalCartPrice,
          success_url,
          fail_url,
          user_data: {
            userId,
            firstName: userDetails?.firstName,
            lastName: userDetails?.lastName,
          },
        });
        const paymentRef: string = response.data.payment_ref;
        if (paymentRef) {
          await WebBrowser.openBrowserAsync(`https://payment.espees.org/pay/${paymentRef}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('Status:', error.response?.status);
          console.log('Message:', error.response?.data);
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setLoading2(false);
      }
    }
  };

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
      await fetchUserCart();
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
    }
  };

  const cartCount = cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory === 'All'
    ? products
    : products.filter((product) => product.category === activeCategory);

  const renderCurrentView = () => {
    if (error && currentView === 'store') {
      return <ErrorScreen onRetry={fetchProducts} />;
    }

    switch (currentView) {
      case 'store':
        return (
          <SafeAreaView className="flex-1 pb-[87px]" style={{ backgroundColor: '#F5F7FA' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
            <View className="flex-1">
              <View className="p-4 space-y-4 pb-16">
                <EnhancedStoreHeader
                  cartCount={cartCount}
                  onSearchPress={() => setCurrentView('search')}
                  onCartPress={() => setCurrentView('cart')}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  showSearch={false}
                />
                
                <ScrollView showsVerticalScrollIndicator={false}>
                  <AutoScrollingPromotionFlyer
                    onBuyNow={(promotion) => {
                      const product = products.find((p) => p.name === promotion.productName);
                      if (product) {
                        addToCart(product);
                      }
                    }}
                  />
                  <ProductGrid
                    products={filteredProducts}
                    onProductPress={(product) => {
                      setSelectedProduct(product);
                      setCurrentView('productDetail');
                    }}
                    onAddToCart={addToCart}
                    loading={loading}
                  />
                </ScrollView>
              </View>
            </View>
          </SafeAreaView>
        );

      case 'search':
        return (
          <SearchResults
            products={filteredProducts}
            searchQuery={searchQuery}
            onProductPress={(product) => {
              setSelectedProduct(product);
              setCurrentView('productDetail');
            }}
            onAddToCart={addToCart}
            onBack={() => {
              setCurrentView('store');
              setSearchQuery('');
            }}
            onSearchChange={setSearchQuery}
          />
        );

      case 'productDetail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setCurrentView('store')}
            onAddToCart={addToCart}
            cartCount={cartCount}
            onCartPress={() => setCurrentView('cart')}
          />
        ) : null;

      case 'cart':
        return (
          <CartScreen
            onBack={() => setCurrentView('store')}
            onCheckout={onCheckout}
            loading={loading2}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5F7FA' }}>
      {renderCurrentView()}
    </SafeAreaView>
  );
};

export default EnhancedStoreApp;