import { TabBar } from "@/components/TabBar";
import { Tabs, useSegments } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_TITLES: Record<string, string> = {
  index: 'Dashboard',
  livetv: 'Live TV',
  store: 'Store',
  profile: 'Profile',
};

function SharedHeader({ routeName }: { routeName: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{
      backgroundColor: '#fff',
      paddingTop: 15,
      paddingHorizontal: 24,
      paddingBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6', // border-gray-100
    }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        {TAB_TITLES[routeName] || ''}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* <TouchableOpacity style={{ marginRight: 12 }}>
          <Feather name="search" size={24} color="#9CA3AF" />
        </TouchableOpacity> */}
        {/* <TouchableOpacity>
          <Feather name="bell" size={24} color="#9CA3AF" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const Layout = () => {
    const segments = useSegments();
    // segments: ["(app)", "(tabs)", "index"] or ["(app)", "(tabs)", "livetv"] etc.
    // The last segment is the tab name
    const routeName = segments[segments.length - 1] || 'index';
    
    // Debug logging
    console.log('Segments:', segments);
    console.log('RouteName:', routeName);
    
    // Check if we're on the home screen - when segments only has ["(app)", "(tabs)"], we're on index
    const isHomeScreen = segments.length === 2 && segments[1] === '(tabs)';
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {!isHomeScreen && <SharedHeader routeName={routeName} />}
            <Tabs tabBar={props => <TabBar {...props} /> }>
            <Tabs.Screen name="index" options={{title: 'Home', headerShown: false}}/>
            <Tabs.Screen name="livetv" options={{title: 'LiveTv', headerShown: false}}/>
            {/*<Tabs.Screen name="testimony" options={{title: 'Testimony', headerShown: false}}/>*/}
            <Tabs.Screen name="store" options={{title: 'Store', headerShown: false}}/>
            <Tabs.Screen name="profile" options={{title: 'Profile', headerShown: false}}/>
            </Tabs>
        </SafeAreaView>
    );
};

export default Layout;

const styles = StyleSheet.create({});