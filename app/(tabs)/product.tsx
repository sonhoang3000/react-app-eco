import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const ProductScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8080/api/get-all-product?id=ALL'); // Tải tất cả sản phẩm
        const data = await response.json();
        if (data.errCode === 0) {
          setProducts(data.products);
          setFilteredProducts(data.products); // Initialize filtered products
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.detailButton} onPress={() => handleViewDetails(item)}>
          <Text style={styles.buttonText}>View Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(item)}>
          <Text style={styles.buttonText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleViewDetails = (item: Product) => {
    const productId = item._id;
    router.push(`/Products_page/${productId}`);
  };

  const handleAddToCart = (item: Product) => {
    console.log(`Đã thêm ${item.name} vào giỏ hàng`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Products</Text>
      <TextInput
        placeholder="Choose the ones you like ..."
        value={searchTerm}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#f8c471" />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f39c12',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#34495e',
  },
  searchInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
  },
  productContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontWeight: 'bold',
    marginVertical: 5,
    fontSize: 16,
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  detailButton: {
    marginBottom: 5,
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
  cartButton: {
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
});

export default ProductScreen;
