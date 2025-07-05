import TabBarButton from '@/components/TabBarButton';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();

  return (
    <>
      {/* Full-width background behind the floating tabbar */}
      <View style={styles.tabbarBackground} pointerEvents="none" />
      <View style={styles.tabbar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
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
              color={isFocused ? '#453ace' : '#657786'}
              label={label}
            />
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabbarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70, // Should match tabbar height (padding + borderRadius)
    backgroundColor: '#fff',
    zIndex: 0,
  },
  tabbar: {
    position: 'absolute',
    bottom: 0,
    // left: 16,
    // right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    // borderRadius: 32,
    paddingTop: 12,
    paddingBottom: 2,
    paddingHorizontal: 16,
    maxWidth: 512,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // elevation: 12,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
});