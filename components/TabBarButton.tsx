import { icon } from '@/constants/icon'; // Assuming your icon mapping is here
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}) => {
  // Animated values for scale, label opacity, and vertical position
  const scaleAnim = useRef(new Animated.Value(isFocused ? 1.15 : 1)).current;
  const labelOpacity = useRef(new Animated.Value(isFocused ? 1 : 0.7)).current;
  const translateY = useRef(new Animated.Value(isFocused ? -8 : 0)).current;
  const bubbleScale = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.15 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
    Animated.timing(labelOpacity, {
      toValue: isFocused ? 1 : 0.7,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.spring(translateY, {
      toValue: isFocused ? -8 : 0,
      useNativeDriver: true,
      friction: 6,
    }).start();
    Animated.spring(bubbleScale, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [isFocused]);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabbarItem}
    >
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }, { translateY }], zIndex: 1 }]}> 
        {icon[routeName]({ color })}
      </Animated.View>
      <Animated.Text style={[styles.label, { color, opacity: labelOpacity, zIndex: 1 }]}>{label}</Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 80,
  },
  tabbarItemFocused: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)', // Matches bg-blue-50
  },
  iconContainer: {
    marginBottom: 4, // Matches space-y-1 in web version
  },
  label: {
    fontSize: 12,
    fontWeight: '500', // Matches font-medium
  },
});