import { CartScreen } from '@/components/cart/CartScreen';
import { ProductDetail } from '@/components/products/ProductDetail';
import { ProductCard } from '@/components/store/ProductCard';
import { useUserCart } from '@/contexts/UserCartContext';
import { useUser } from '@/contexts/UserContext';
import { Product } from '@/types'; // Import Product type from centralized types
import { API_URL } from '@/utils/env';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Get screen width for carousel
const { width: screenWidth } = Dimensions.get('window');

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
    <View style={styles.headerContainer}>
      <View className="flex-1 relative">
        <Feather
          name="search"
          size={20}
          color="#666666"
          style={{ position: 'absolute', left: 20, top: '50%', transform: [{ translateY: -10 }], zIndex: 1 }}
        />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search products..."
          className="w-full pr-4 py-3 rounded-xl text-sm text-gray-800"
          onFocus={onSearchPress}
          placeholderTextColor="#666666"
          editable={true}
          style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            fontWeight: '400',
            marginHorizontal: 0,
            paddingLeft: 50
          }}
        />
      </View>
      <TouchableOpacity className="relative p-2 mr-3" onPress={onCartPress}>
        <Feather name="shopping-cart" size={24} color="#666666" />
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
                ? '#0c0c5f' 
                : '#f8f9fa',
              borderWidth: activeCategory === category || (index === 0 && activeCategory === 'All') ? 0 : 1,
              borderColor: '#f8f9fa'
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
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const promotions = [
    {
      id: 1,
      title: 'Graduation Season',
      subtitle: 'Doctorate Graduation Gown - Special Offer',
      price: '45.7 Espees',
      originalPrice: '55.5 Espees',
      buttonText: 'Buy Now',
      colors: ['#0c0c5f', '#3d3d8f'] as [string, string],
      productName: 'Doctorate Graduation Gown'
    },
    {
      id: 2,
      title: 'Student Combo',
      subtitle: 'New Arrivals - Up to 20% Off',
      price: 'From 29.99 Espees',
      originalPrice: '',
      buttonText: 'Shop Now',
      colors: ['#ffe800', '#fea601'] as [string, string],
      productName: 'Student Combo'
    }
    // ,{
    //   id: 3,
    //   title: 'Back to School',
    //   subtitle: 'School Supplies & Uniforms',
    //   price: 'From 19.99 Espees',
    //   originalPrice: '',
    //   buttonText: 'Explore',
    //   colors: ['#4CAF50', '#8BC34A'] as [string, string],
    //   productName: 'School Supplies'
    // },
    // {
    //   id: 4,
    //   title: 'Holiday Special',
    //   subtitle: 'Festive Collection - Limited Time',
    //   price: 'From 39.99 Espees',
    //   originalPrice: '79.99 Espees',
    //   buttonText: 'Get Offer',
    //   colors: ['#9C27B0', '#7B68EE'] as [string, string],
    //   productName: 'Holiday Collection'
    // }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    slideAnim.setValue(40); // Start slightly to the right
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const currentPromotion = promotions[currentIndex];

  return (
    <View style={styles.promotionContainer}>
      <Animated.View style={{ width: '100%', transform: [{ translateX: slideAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onBuyNow(currentPromotion)}
          style={styles.promotionCard}
        >
          <LinearGradient
            colors={currentPromotion.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promotionGradient}
          >
            <View className="h-full justify-between">
              <View>
                <Text className="text-white text-2xl font-bold mb-1">
                  {currentPromotion.title}
                </Text>
                <Text className="text-white text-base opacity-90">
                  {currentPromotion.subtitle}
                </Text>
              </View>
              
              <View className="flex-row items-center justify-between mt-4">
                <View>
                  <Text className="text-white text-2xl font-bold">
                    {currentPromotion.price}
                  </Text>
                  {currentPromotion.originalPrice && (
                    <Text className="text-white opacity-70 line-through">
                      {currentPromotion.originalPrice}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  className="bg-white px-4 py-2 rounded-full"
                  style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  <Text className="text-primary font-semibold">
                    {currentPromotion.buttonText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const PRODUCT_GRID_GAP = 16;
const PRODUCT_GRID_COLUMNS = 2;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - (PRODUCT_GRID_GAP * (PRODUCT_GRID_COLUMNS + 1))) / PRODUCT_GRID_COLUMNS;

const ProductGrid: React.FC<{
  products: Product[];
  onProductPress: (product: Product) => void;
  onAddToCart: (product: Product) => Promise<void>;
  loading: boolean;
  contentContainerStyle?: any;
}> = ({ products, onProductPress, onAddToCart, loading, contentContainerStyle }) => {
  const LoadingCard = () => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: PRODUCT_GRID_GAP, justifyContent: 'space-between' }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={{ width: CARD_WIDTH, marginBottom: PRODUCT_GRID_GAP }}>
            <View className="bg-white rounded-xl overflow-hidden mb-4" style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 6,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#E1E8ED'
            }}>
              <View className="h-52 bg-gray-200 animate-pulse" />
              <View className="p-3">
                <View className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                <View className="h-3 bg-gray-200 rounded mb-2 animate-pulse" style={{ width: '60%' }} />
                <View className="flex-row justify-between items-center">
                  <View className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '40%' }} />
                  <View className="h-6 bg-gray-200 rounded-full animate-pulse" style={{ width: 60 }} />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (products.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Feather name="package" size={48} color="#657786" />
        <Text className="text-gray-500 text-lg font-medium mt-4">No products found</Text>
        <Text className="text-gray-400 text-sm text-center mt-2">
          Try adjusting your search or browse our categories
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={PRODUCT_GRID_COLUMNS}
      columnWrapperStyle={{ gap: PRODUCT_GRID_GAP, marginBottom: PRODUCT_GRID_GAP }}
      contentContainerStyle={{ ...contentContainerStyle }}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => onProductPress(item)}
          onAddToCart={async (p) => { await onAddToCart(p); }}
          cardWidth={CARD_WIDTH}
        />
      )}
    />
  );
};

const ErrorScreen: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: '#F5F7FA' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View className="items-center px-8">
        <Feather name="wifi-off" size={64} color="#657786" />
        <Text className="text-gray-800 text-xl font-semibold mt-4 mb-2">Connection Error</Text>
        <Text className="text-gray-600 text-center mb-6">
          Unable to load products. Please check your internet connection and try again.
        </Text>
        <TouchableOpacity
          onPress={onRetry}
          className="bg-blue-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View className="flex-1">
        <View className="p-4" style={{ paddingBottom: 0 }}>
          <View className="flex-row items-center" style={{ marginBottom: 16 }}>
            <TouchableOpacity onPress={onBack} className="p-2" style={{ marginRight: 8 }}>
              <Feather name="arrow-left" size={24} color="#657786" />
            </TouchableOpacity>
            <View className="flex-1">
              <TextInput
                value={searchQuery}
                onChangeText={onSearchChange}
                placeholder="Search products..."
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800"
                placeholderTextColor="#657786"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  fontWeight: '400',
                }}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between" style={{ marginBottom: 20 }}>
            <Text className="text-gray-800 text-lg font-semibold">
              Search Results
            </Text>
            <Text className="text-gray-600 text-sm">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>
        <ProductGrid
          products={products}
          onProductPress={onProductPress}
          onAddToCart={async (product) => {
            await onAddToCart(product);
          }}
          loading={false}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}
        />
      </View>
    </SafeAreaView>
  );
};

// Utility to pad data for grid centering
function padGridData<T extends { id: string }>(data: T[], columns: number): (T & { empty?: boolean })[] {
  const fullRows = Math.floor(data.length / columns);
  const lastRowItems = data.length - fullRows * columns;
  if (lastRowItems === 0) return data;
  return [
    ...data,
    ...Array.from({ length: columns - lastRowItems }).map((_, i) => ({ id: `empty-${i}`, empty: true } as T & { empty: boolean }))
  ];
}

const EnhancedStoreApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { cart, addToCart, fetchUserCart } = useUserCart();
  const { userId, userDetails } = useUser();

  const categories = ['All', 'Books', 'Uniforms', 'Accessories', 'Electronics'];

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

  const updateCartQuantity = async (id: string, newQuantity: number) => {
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
            <View className="flex-1 items-center">
              <FlatList
                data={padGridData(filteredProducts, PRODUCT_GRID_COLUMNS)}
                keyExtractor={(item) => item.id}
                numColumns={PRODUCT_GRID_COLUMNS}
                columnWrapperStyle={{ gap: PRODUCT_GRID_GAP, marginBottom: PRODUCT_GRID_GAP }}
                contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
                ListHeaderComponent={
                  <>
                    <View style={{ paddingHorizontal: 0, paddingTop: 16, paddingBottom: 16 }}>
                      <EnhancedStoreHeader
                        cartCount={cartCount}
                        onSearchPress={() => setCurrentView('search')}
                        onCartPress={() => setCurrentView('cart')}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        showSearch={false}
                      />
                      <View style={{ marginTop: 16 }}>
                        <AutoScrollingPromotionFlyer
                          onBuyNow={(promotion) => {
                            const product = products.find((p) => p.name === promotion.productName);
                            if (product) {
                              addToCart(product);
                            }
                          }}
                        />
                      </View>
                    </View>
                  </>
                }
                renderItem={({ item }) =>
                  item.empty ? (
                    <View style={{paddingHorizontal: PRODUCT_GRID_GAP, width: CARD_WIDTH, marginBottom: PRODUCT_GRID_GAP, backgroundColor: 'transparent' }} />
                  ) : (
                    <ProductCard
                      product={item}
                      onPress={() => {
                        setSelectedProduct(item);
                        setCurrentView('productDetail');
                      }}
                      onAddToCart={async (p) => {
                        await addToCart(p);
                      }}
                      cardWidth={CARD_WIDTH}
                    />
                  )
                }
                ListEmptyComponent={
                  loading ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: PRODUCT_GRID_GAP, justifyContent: 'space-between', paddingHorizontal: PRODUCT_GRID_GAP }}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <View key={index} style={{ width: CARD_WIDTH, marginBottom: PRODUCT_GRID_GAP }}>
                          <View className="bg-white rounded-xl overflow-hidden mb-4" style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 6,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: '#E1E8ED'
                          }}>
                            <View className="h-52 bg-gray-200 animate-pulse" />
                            <View className="p-3">
                              <View className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                              <View className="h-3 bg-gray-200 rounded mb-2 animate-pulse" style={{ width: '60%' }} />
                              <View className="flex-row justify-between items-center">
                                <View className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '40%' }} />
                                <View className="h-6 bg-gray-200 rounded-full animate-pulse" style={{ width: 60 }} />
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className="flex-1 justify-center items-center py-8">
                      <Feather name="package" size={48} color="#657786" />
                      <Text className="text-gray-500 text-lg font-medium mt-4">No products found</Text>
                      <Text className="text-gray-400 text-sm text-center mt-2">
                        Try adjusting your search or browse our categories
                      </Text>
                    </View>
                  )
                }
              />
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
            onAddToCart={async (product) => {
              await addToCart(product);
            }}
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

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 6,
    // backgroundColor: 'transparent',
    borderRadius: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  promotionContainer: {
    marginBottom: 24,
  },
  promotionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  promotionGradient: {
    padding: 24,
    height: 160,
  },
});export default EnhancedStoreApp;

