import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HamburgerMenu() {
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAnimation = useState(new Animated.Value(0))[0];

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const menuTranslateX = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 0], 
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu}>
        <Icon name="menu" size={30} color="black" />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: menuTranslateX }] },
        ]}
      >
        <TouchableOpacity onPress={() => { setIsMenuOpen(false); navigation.navigate('account'); }}>
          <Text style={styles.menuText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setIsMenuOpen(false); navigation.navigate('product'); }}>
          <Text style={styles.menuText}>Product</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setIsMenuOpen(false); navigation.navigate('cart'); }}>
          <Text style={styles.menuText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
          <Text style={styles.menuText}>Exit</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 5, 
    zIndex: 10, 
  },
 menuContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    width: 200,  // Đặt chiều rộng của menu để đủ chỗ cho các mục
  },
  menuText: {
    fontSize: 16,
    paddingVertical: 15,  // Tăng khoảng cách giữa các mục để không bị chật
    color: '#333',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',  // Căn giữa văn bản
  },
});
