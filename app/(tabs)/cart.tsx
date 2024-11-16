import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface CartItem {
  _id: string;
  nameProduct: string;
  priceProduct: number;
  number: number;
  quality: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          alert('You are not logged in!');
          return;
        }

        const userId = '1';
        const response = await axios.get(`http://192.168.1.127:8080/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCartItems(response.data.carts.items);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const removeItemFromCart = async (itemId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('You are not logged in!');
        return;
      }

      await axios.delete('http://192.168.1.127:8080/api/delete-cart', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: itemId },
      });
      setCartItems(cartItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : cartItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        cartItems.map(item => (
          <View key={item._id} style={{ marginBottom: 20 }}>
            <Text>{item.nameProduct}</Text>
            <Text>Price: ${item.priceProduct}</Text>
            <TextInput
              style={{ borderWidth: 1, padding: 5, marginTop: 10 }}
              keyboardType="numeric"
              value={item.number.toString()}
              onChangeText={(text) => console.log('Updated quantity:', text)}
            />
            <Button title="Remove" onPress={() => removeItemFromCart(item._id)} />
          </View>
        ))
      )}
      <Button title="Proceed to Checkout" onPress={() => router.push('/checkout')} />
    </View>
  );
};

export default CartPage;
