import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85; // Card takes 85% of screen width
const cardSpacing = 20;

const events = [
    {
        id: '1',
        title: 'Praise Night 23',
        date: '25',
        month: 'MAY',
        minister: 'With Pastor Chris Oyakhilome',
        platform: 'Streaming on LWFS TV',
        time: '2PM GMT+1',
        gradientColors: ['#9333ea', '#e11d48'],
    },
    {
        id: '2',
        title: 'June Communion Service',
        date: '1',
        month: 'JUNE',
        minister: 'With Pastor Chris Oyakhilome',
        platform: 'Streaming on LWFS TV',
        time: '3PM GMT+1',
        gradientColors: ['#2563eb', '#06b6d4'],
    },
    {
        id: '3',
        title: 'Healing Service',
        date: '15',
        month: 'JUNE',
        minister: 'With Pastor Chris Oyakhilome',
        platform: 'Streaming on LWFS TV',
        time: '4PM GMT+1',
        gradientColors: ['#059669', '#0d9488'],
    },
    {
        id: '4',
        title: 'Prayer Meeting',
        date: '30',
        month: 'JUNE',
        minister: 'With Pastor Chris Oyakhilome',
        platform: 'Streaming on LWFS TV',
        time: '5PM GMT+1',
        gradientColors: ['#dc2626', '#ea580c'],
    }
];

export default function EventCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef(null);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const cardWidthWithSpacing = cardWidth + cardSpacing;
        const currentIndex = Math.round(scrollPosition / cardWidthWithSpacing);
        setActiveIndex(currentIndex);
    };

    const scrollToCard = (index) => {
        const cardWidthWithSpacing = cardWidth + cardSpacing;
        const scrollPosition = index * cardWidthWithSpacing;
        scrollViewRef.current?.scrollTo({
            x: scrollPosition,
            animated: true,
        });
        setActiveIndex(index);
    };

    const renderEventCard = (event, index) => (
        <TouchableOpacity
            key={event.id}
            className="bg-white rounded-2xl p-6 shadow-lg"
            style={{
                width: cardWidth,
                marginLeft: index === 0 ? cardSpacing : cardSpacing / 2,
                marginRight: index === events.length - 1 ? cardSpacing : cardSpacing / 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
            }}
            activeOpacity={0.8}
            onPress={() => console.log('Event pressed:', event.title)}
        >
            {/* Header with title and date */}
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-4">
                    <Text className="text-xl font-bold text-gray-900 mb-2" numberOfLines={2}>
                        {event.title}
                    </Text>
                    <Text className="text-base text-gray-600">
                        {event.time}
                    </Text>
                </View>

                {/* Date Badge */}
                <LinearGradient
                    colors={event.gradientColors}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text className="text-xl font-bold text-white leading-none">
                        {event.date}
                    </Text>
                    <Text className="text-sm text-white opacity-90 leading-none mt-1">
                        {event.month.slice(0, 3)}
                    </Text>
                </LinearGradient>
            </View>

            {/* Minister */}
            <Text className="text-base font-medium text-gray-700 mb-3" numberOfLines={1}>
                {event.minister}
            </Text>

            {/* Platform */}
            <View className="bg-gray-100 rounded-lg p-3">
                <Text className="text-sm text-gray-600 text-center" numberOfLines={1}>
                    📺 {event.platform}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="mt-6">
            {/* Header */}
            <View className="mb-6 px-6">
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                    Upcoming Events
                </Text>
                <Text className="text-base text-gray-600">
                    Swipe to explore more events
                </Text>
            </View>

            {/* Carousel */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled={false}
                decelerationRate="fast"
                snapToInterval={cardWidth + cardSpacing}
                snapToAlignment="start"
                contentInsetAdjustmentBehavior="never"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{
                    paddingVertical: 10,
                }}
            >
                {events.map((event, index) => renderEventCard(event, index))}
            </ScrollView>

            {/* Pagination Dots */}
            <View className="flex-row justify-center items-center mt-6 mb-4">
                {events.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => scrollToCard(index)}
                        className="w-2 h-2 rounded-full mx-1"
                        style={{
                            backgroundColor: index === activeIndex ? '#453ace' : '#d1d5db',
                            width: index === activeIndex ? 8 : 6,
                            height: index === activeIndex ? 8 : 6,
                        }}
                    />
                ))}
            </View>
        </View>
    );
}