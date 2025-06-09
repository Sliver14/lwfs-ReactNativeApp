import React from "react";
import { View, Platform, StyleSheet } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Feather} from "@expo/vector-icons";
import TabBarButton from "@/components/TabBarButton";

export function TabBar({ state, descriptors, navigation }:BottomTabNavigator ) {
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();

    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TabBarButton
                        key={route.name}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName={route.name}
                        color={isFocused ? "#3b82f6" : " #9ca3af"}
                        label={label}
                    />


                    // <PlatformPressable
                    //     key={route.name}
                    //     href={buildHref(route.name, route.params)}
                    //     accessibilityState={isFocused ? { selected: true } : {}}
                    //     accessibilityLabel={options.tabBarAccessibilityLabel}
                    //     testID={options.tabBarButtonTestID}
                    //     onPress={onPress}
                    //     onLongPress={onLongPress}
                    //     style={styles.tabbarItem}
                    // >
                    //     {icon[route.name]({
                    //         color: isFocused ? "#673ab7" : "#222"
                    //     })}
                    //     <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
                    //         {label}
                    //     </Text>
                    // </PlatformPressable>

                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        // marginHorizontal: 0,
        paddingVertical: 15,
        paddingHorizontal: 15,
        // borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.2,
    },
})
