import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const FoodProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Xử lý thêm vào giỏ hàng
    console.log('Sản phẩm đã được thêm vào giỏ hàng');
  };

  return (
    <View style={styles.container}>
      {/* Ảnh sản phẩm */}
      <Image
        source={require('../../assets/images/food/hamburger.jpg')}
        style={styles.productImage}
      />

      {/* Thông tin sản phẩm */}
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>Hamburger</Text>
        <Text style={styles.productPrice}>9.999.999đ</Text>
         {/* Số lượng */}
         <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => setQuantity(quantity - 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryTime}>15mins</Text>
          <Text style={styles.reviewCount}>32+ Review</Text>
          <Text style={styles.rating}>4.2 Ratings</Text>
        </View>

        {/* Thêm nguyên liệu */}
        <Text style={styles.extraIngredientText}>Add extra Ingredient</Text>
        <TextInput
          style={styles.extraIngredientInput}
          placeholder="Enter extra ingredient"
        />

        {/* Mô tả sản phẩm */}
        <Text style={styles.productDescription}>
          Với hương vị độc đáo và cách chế biến tinh tế, hamburger đã được nhiều bạn trẻ Việt Nam tìm đến và tận
          hưởng niềm vui bởi vị ngon của nó
        </Text>

        {/* Nút thêm vào giỏ hàng */}
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to cart</Text>
        </TouchableOpacity>

       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'center',  // Căn giữa theo chiều dọc
    alignItems: 'center',  // Căn giữa theo chiều ngang
  },
  productImage: {
    width: '100%',  // Chiếm toàn bộ chiều rộng của phần tử cha
    height: undefined,  // Để chiều cao tự động tính theo aspectRatio
    aspectRatio: 1,  // Đảm bảo tỷ lệ 1:1
    borderRadius: 10,
    marginBottom: 20,
    maxWidth: 400,  // Giới hạn chiều rộng tối đa là 200px
    maxHeight: 400,  // Giới hạn chiều cao tối đa là 200px
  },
  productInfo: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    color: '#ff6347',
    marginTop: 5,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#888',
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
  },
  rating: {
    fontSize: 14,
    color: '#ff6347',
  },
  extraIngredientText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  extraIngredientInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#333',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default FoodProductPage;
