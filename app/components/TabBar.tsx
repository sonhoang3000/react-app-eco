import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function TabBar({ screens }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#f8c471',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {screens}
    </Tab.Navigator>
  );
}
