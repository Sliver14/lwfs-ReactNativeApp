import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Event, fetchEvents } from '../utils/eventService';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85; // Card takes 85% of screen width
const cardSpacing = 20;

// Predefined gradient colors for events
const gradientColors = [
    ['#9333ea', '#e11d48'], // Purple to Red
    ['#2563eb', '#06b6d4'], // Blue to Cyan
    ['#059669', '#0d9488'], // Green to Teal
    ['#dc2626', '#ea580c'], // Red to Orange
    ['#7c3aed', '#ec4899'], // Purple to Pink
    ['#0891b2', '#0ea5e9'], // Cyan to Blue
    ['#16a34a', '#22c55e'], // Green to Emerald
    ['#f59e0b', '#f97316'], // Yellow to Orange
];

export default function EventCarousel() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedEvents = await fetchEvents({
                activeOnly: true,
                limit: 10
            });
            setEvents(fetchedEvents);
        } catch (err) {
            setError('Failed to load events');
            console.error('Error loading events:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString();
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        return { day, month };
    };

    const getGradientColors = (index: number) => {
        return gradientColors[index % gradientColors.length];
    };

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

    const renderEventCard = (event: Event, index: number) => {
        const { day, month } = formatDate(event.date);
        const colors = getGradientColors(index);

        return (
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
                        colors={colors}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text className="text-xl font-bold text-white leading-none">
                            {day}
                        </Text>
                        <Text className="text-sm text-white opacity-90 leading-none mt-1">
                            {month}
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
    };

    if (loading) {
        return (
            <View className="mt-6 px-6">
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                    Upcoming Events
                </Text>
                <View className="items-center justify-center py-8">
                    <ActivityIndicator size="large" color="#453ace" />
                    <Text className="text-gray-600 mt-2">Loading events...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="mt-6 px-6">
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                    Upcoming Events
                </Text>
                <View className="items-center justify-center py-8">
                    <Text className="text-gray-600 mb-4">{error}</Text>
                    <TouchableOpacity 
                        onPress={loadEvents}
                        className="bg-[#453ace] px-4 py-2 rounded-lg"
                    >
                        <Text className="text-white font-medium">Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (events.length === 0) {
        return (
            <View className="mt-6 px-6">
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                    Upcoming Events
                </Text>
                <View className="items-center justify-center py-8">
                    <Text className="text-gray-600">No upcoming events</Text>
                </View>
            </View>
        );
    }

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