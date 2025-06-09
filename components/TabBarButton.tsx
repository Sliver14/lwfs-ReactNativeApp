import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
// import {PlatformPressable} from "@react-navigation/elements";
import {icon} from "@/constants/icon";
import {useSharedValue, withSpring} from "react-native-reanimated";



const TabBarButton = ({
      onPress,
      onLongPress,
      isFocused,
      routeName,
      color,
      label,
  }: {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: string;
    color: string;
    label: string;
}) => {
    // const scale = useSharedValue(0);
    //
    // useEffect(() => {
    //     scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused , {duration: 350});
    // }, [scale, isFocused]);
    //
    // const animatedTestStyles = useSharedValue(() => {
    //     const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    // });

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
        >
            {icon[routeName]({
                color: isFocused ? "#673ab7" : "#222"
            })}
            <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
                {label}
            </Text>
        </Pressable>
    );
};

export default TabBarButton;

const styles = StyleSheet.create({
    tabbarItem: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
    }
});
