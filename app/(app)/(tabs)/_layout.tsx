import { TabBar } from "@/components/TabBar";
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const Layout = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tabs tabBar={props => <TabBar {...props} />}>
            <Tabs.Screen name="index" options={{title: 'Home', headerShown: false}}/>
            <Tabs.Screen name="livetv" options={{title: 'LiveTv', headerShown: false, unmountOnBlur: false }}/>
            {/*<Tabs.Screen name="testimony" options={{title: 'Testimony', headerShown: false}}/>*/}
            <Tabs.Screen name="store" options={{title: 'Store', headerShown: false}}/>
            <Tabs.Screen name="profile" options={{title: 'Profile', headerShown: false}}/>
            </Tabs>
        </SafeAreaView>
               
    );
};

export default Layout;

const styles = StyleSheet.create({});