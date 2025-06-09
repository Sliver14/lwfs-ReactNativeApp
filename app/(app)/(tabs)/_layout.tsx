import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {Tabs} from 'expo-router';
import { TabBar } from "@/components/TabBar";

const Layout = () => {
    return (
        <Tabs tabBar={props => <TabBar {...props} />}>
            <Tabs.Screen name="index" options={{title: 'Home', headerShown: false}}/>
            <Tabs.Screen name="livetv" options={{title: 'LiveTv', headerShown: false, unmountOnBlur: false }}/>
            {/*<Tabs.Screen name="testimony" options={{title: 'Testimony', headerShown: false}}/>*/}
            <Tabs.Screen name="store" options={{title: 'Store', headerShown: false}}/>
            <Tabs.Screen name="profile" options={{title: 'Profile', headerShown: false}}/>
        </Tabs>
    );
};

export default Layout;

const styles = StyleSheet.create({});