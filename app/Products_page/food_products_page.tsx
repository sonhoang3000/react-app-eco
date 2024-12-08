import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetailScreen: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Lấy ID sản phẩm từ URL params

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true); // Đảm bảo trạng thái loading được đặt lại mỗi khi id thay đổi
      try {
        const response = await fetch(`http://192.168.231.117:8080/api/get-product-detail?id=${id}`);
        const data = await response.json();
        if (data.errCode === 0) {
          setProduct(data.product);
        } else {
          console.error('Product not found.');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }

  }, [id]); // Chạy lại khi id thay đổi

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f8c471" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.buttonText}>Back to Products</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f39c12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f39c12',
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    marginVertical: 10,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#d35400',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
  },
});

export default ProductDetailScreen;
