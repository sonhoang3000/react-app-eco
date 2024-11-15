import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [id, setId] = useState<string>('ALL');
  const [bannerIndex, setBannerIndex] = useState<number>(0);

  const fetchProducts = async () => {
    try {
      let response = await fetch(`http://192.168.1.6:8080/api/get-all-product?id=${id}`);
      let data = await response.json();
      if (data.errCode === 0) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

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
    <View style={{ margin: 10, width: (width / 2) - 20, alignItems: 'center' }}>
      <Image source={{ uri: item.image }} style={{ width: '100%', height: 150, borderRadius: 8 }} resizeMode="contain" />
      <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{item.name}</Text>
      <Text>${item.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={{ backgroundColor: '#f8c471', padding: 10, borderRadius: 5, marginTop: 5 }}
        onPress={() => navigation.navigate('cart')}
      >
        <Text style={{ textAlign: 'center' }}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  const banners = [
    'https://i.pinimg.com/736x/3b/b8/46/3bb84646c800d861fdb64ee627607e74.jpg',
    'https://i.pinimg.com/736x/0a/ec/c6/0aecc648940982a68d54cefaf8516db7.jpg',
    'https://i.pinimg.com/736x/3b/b8/46/3bb84646c800d861fdb64ee627607e74.jpg',
    'https://i.pinimg.com/736x/24/bc/ef/24bcef4070493bd086f601622ced04ea.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>MEAT MEAL</Text>
                <TouchableOpacity onPress={() => navigation.navigate('account')}>
                  <Icon name="person-outline" size={30} color="black" />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                <Text>📍Current Location</Text>
                <Text>VietNam</Text>
                <TouchableOpacity onPress={() => console.log('Notification clicked')}>
                  <Icon name="notifications-outline" size={30} color="black" />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="What will you like to eat?"
                value={searchTerm}
                onChangeText={handleSearch}
                style={{
                  borderWidth: 1, padding: 10, borderRadius: 10, marginVertical: 10
                }}
              />
            </View>

            <View style={{ width: '100%', height: 200 }}>
              <Image source={{ uri: banners[bannerIndex] }} style={{ width, height: 200 }} />
            </View>

            <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Recommended</Text>
              <FlatList
                horizontal
                data={filteredProducts.slice(0, 5)} 
                renderItem={renderProduct}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginTop: 10 }}
              />
            </View>

            <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>More</Text>
            </View>
          </>
        }
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color="#f8c471" />
          ) : (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: 'gray' }}>MEAT MEAL N11</Text>
              <TouchableOpacity onPress={() => navigation.navigate('account')}>
                <Text style={{ color: '#f8c471', marginTop: 10 }}>Go to Account</Text>
              </TouchableOpacity>
            </View>
          )
        }
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
}
