import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  category: string;
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
        const response = await fetch(`http://192.168.10.49:8080/api/get-all-product?id=${id}`);
        const data = await response.json();
        console.log('Fetched data:', data);

        // Kiểm tra dữ liệu từ API
        if (data.errCode === 0 && data.products) {
          setProduct(data.products);
        } else {
          console.error('Sản phẩm không tìm thấy hoặc có lỗi từ API.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
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
        <Text style={styles.errorText}>Không tìm thấy sản phẩm.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Đảm bảo description là chuỗi hợp lệ
  const productDescription = typeof product.description === 'string' ? product.description : 'Không có mô tả';

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.productCategory}>Danh mục: {product.category}</Text>

        <Text style={styles.ingredientsTitle}>Thành phần:</Text>
        <View style={styles.ingredientsContainer}>
          {product.ingredients.length > 0 ? (
            product.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>- {ingredient}</Text>
            ))
          ) : (
            <Text style={styles.ingredientText}>Không có thành phần nào được liệt kê.</Text>
          )}
        </View>

        <Text style={styles.productDescription}>{productDescription}</Text>

        <TouchableOpacity onPress={() => {}} style={styles.addToCartButton}>
          <Text style={styles.buttonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.buttonText}>Quay lại sản phẩm</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f39c12',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f39c12',
  },
  scrollViewContent: {
    alignItems: 'center',  // Căn giữa các phần tử trong ScrollView
    paddingHorizontal: 16, // Thêm padding ngang để tạo khoảng cách giữa lề màn hình và các phần tử
  },
  productImage: {
    width: '100%',  // Chiếm 100% chiều rộng màn hình
    height: 'auto',  // Chiều cao tự động để giữ tỷ lệ
    aspectRatio: 1,  // Tỷ lệ 1:1 để tạo hình vuông
    borderRadius: 8,
    marginBottom: 20,
  },
  productDetails: {
    width: '100%',  // Đảm bảo các phần tử chiếm hết chiều rộng màn hình
    paddingHorizontal: 16, // Thêm padding ngang
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
    textAlign: 'left',  // Căn lề trái
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'left',  // Căn lề trái
    marginVertical: 10,
  },
  productCategory: {
    fontSize: 16,
    color: '#2c3e50',
    marginVertical: 5,
    textAlign: 'left',  // Căn lề trái
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginTop: 20,
    textAlign: 'left',  // Căn lề trái
  },
  ingredientsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  ingredientText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'left',  // Căn lề trái
  },
  productDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    marginVertical: 10,
    textAlign: 'left',  // Căn lề trái
  },
  addToCartButton: {
    backgroundColor: '#d35400',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',  // Đảm bảo nút chiếm hết chiều rộng màn hình
  },
  backButton: {
    backgroundColor: '#d35400',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
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
