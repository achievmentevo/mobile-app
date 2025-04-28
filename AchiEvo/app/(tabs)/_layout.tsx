import { Tabs } from 'expo-router';
import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import { Platform } from 'react-native';

const Stack = createStackNavigator();

export default function TabLayout() {

  return (
        <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        {/* <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        /> */}
      </Tabs>   
  );
}
