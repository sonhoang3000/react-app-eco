import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f8c471',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => <Icon name="home-outline" size={24} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          tabBarIcon: ({ color }) => <Icon name="fast-food-outline" size={24} color={color} />,
          tabBarLabel: 'Product',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color }) => <Icon name="cart-outline" size={24} color={color} />,
          tabBarLabel: 'Cart',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ color }) => <Icon name="person-outline" size={24} color={color} />,
          tabBarLabel: 'Account',
        }}
      />
      
    </Tabs>
  );
}
