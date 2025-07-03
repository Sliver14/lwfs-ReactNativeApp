// components/product/ProductDetail.tsx
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  iconName?: string;
}

interface ProductDetailProps {
    product: Product;
    onBack: () => void;
    onAddToCart: (product: Product) => void;
    cartCount: number;
    onCartPress?: () => void;
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

export const ProductDetail: React.FC<ProductDetailProps> = ({
                                                                product,
                                                                onBack,
                                                                onAddToCart,
                                                                cartCount,
                                                                onCartPress
                                                            }) => {
    const IconComponent = getIconComponent(product.iconName || '');

    return (
        <ScrollView className="flex-1 bg-gray-50 mb-[50px]" showsVerticalScrollIndicator={false}>
            <View className="bg-white p-6 shadow-sm">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity onPress={onBack} className="p-2">
                        <Feather name="arrow-left" size={20} color="#6B7280"/>
                    </TouchableOpacity>
                    <TouchableOpacity className="relative p-2" onPress={onCartPress}>
                        <Feather name="shopping-cart" size={28} color="#6B7280" />
                        {cartCount > 0 && (
                            <Badge className="absolute -top-1 -right-1">
                                {cartCount}
                            </Badge>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <Card className="m-6 mt-4 overflow-hidden">
                <View className="h-[350px] bg-gray-100 items-center justify-center">
                    <Image
                        source={{ uri: product.imageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                </View>
                <View className="p-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">{product.name}</Text>
                    <Text className="text-3xl font-bold text-blue-500 mb-4">{product.price} Espees</Text>
                    <Text className="text-gray-500 text-base mb-6 leading-6">
                        {product.description}
                    </Text>

                    {/*<View className="flex-row items-center mb-6 gap-4">*/}
                    {/*    <View className="flex-row gap-0.5">*/}
                    {/*        {[...Array(5)].map((_, i) => (*/}
                    {/*            <AntDesign*/}
                    {/*                key={i}*/}
                    {/*                name="star"*/}
                    {/*                size={16}*/}
                    {/*                color={i < 4 ? "#FFA500" : "#D1D5DB"}*/}
                    {/*            />*/}
                    {/*        ))}*/}
                    {/*    </View>*/}
                    {/*    <Text className="text-gray-500 text-sm">4.2 (124 reviews)</Text>*/}
                    {/*</View>*/}

                    <Button onPress={() => onAddToCart(product)}>
                        Add to Cart
                    </Button>
                </View>
            </Card>

            {/*<View className="p-6">*/}
            {/*    <Text className="text-lg font-bold text-gray-800 mb-4">Customer Reviews</Text>*/}
            {/*    <ReviewCard*/}
            {/*        name="Sarah M."*/}
            {/*        rating={5}*/}
            {/*        review="Excellent quality and fast shipping. Highly recommended!"*/}
            {/*        date="2 weeks ago"*/}
            {/*    />*/}
            {/*    <ReviewCard*/}
            {/*        name="John D."*/}
            {/*        rating={4}*/}
            {/*        review="Great product, exactly as described. Very satisfied with my purchase."*/}
            {/*        date="1 month ago"*/}
            {/*    />*/}
            {/*</View>*/}
        </ScrollView>
    );
};

interface ReviewCardProps {
    name: string;
    rating: number;
    review: string;
    date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, rating, review, date }) => (
    <Card className="p-4 mb-4">
        <View className="flex-row justify-between items-center mb-2">
            <Text className="font-semibold text-gray-800">{name}</Text>
            <Text className="text-gray-400 text-xs">{date}</Text>
        </View>
        <View className="flex-row gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
                <AntDesign
                    key={i}
                    name="star"
                    size={12}
                    color={i < rating ? "#FFA500" : "#D1D5DB"}
                />
            ))}
        </View>
        <Text className="text-gray-700 text-sm leading-5">{review}</Text>
    </Card>
);