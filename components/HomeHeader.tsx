// HomeHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, Bell } from 'lucide-react-native';

interface HomeHeaderProps {
    name: string;
    onSearchPress?: () => void;
    onNotificationPress?: () => void;
}

// const getGreeting = (): string => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 17) return 'Good Afternoon';
//     return 'Good Evening';
// };

const HomeHeader: React.FC<HomeHeaderProps> = ({
                                                   name,
                                                   onSearchPress,
                                                   onNotificationPress
                                               }) => (
    <View style={styles.container}>
        <View style={styles.textContainer}>
            <Text style={styles.greeting}>
                Welcome, {name}
            </Text>
            <Text style={styles.subtitle}>
                Continue your spiritual journey
            </Text>
        </View>

        <View style={styles.actionsContainer}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={onSearchPress}
                activeOpacity={0.7}
            >
                <Search size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.iconButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
            >
                <Bell size={20} color="#6b7280" />
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    subtitle: {
        color: '#6b7280',
        marginTop: 2,
        fontSize: 14,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
});

export default HomeHeader;