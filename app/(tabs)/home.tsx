import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import HamburgerMenu from '../components/hmenu';
import { createNewCart, getAllCart } from "../../services/cartServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { router } from 'expo-router';

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
	const [cart, setCart] = useState<Product[]>([]); // Local state for the cart
	const [bannerIndex, setBannerIndex] = useState<number>(0);

	const fetchProducts = async () => {
		try {
			let response = await fetch(`http://10.0.2.2:8080/api/get-all-product?id=ALL`);
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

	const handleAddToCart = async (product) => {
		try {
			const storedUser = await AsyncStorage.getItem("user");
			const user = JSON.parse(storedUser);
			if (!user) {
				Toast.show({
					type: "error",
					text1: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng"
				});
				return;
			}

			const response = await getAllCart();
			const userCarts = response.carts.filter(
				(cart) => cart.idUser === user.id
			);
			const currentCart = Array.isArray(userCarts) ? userCarts : []; // Đảm bảo currentCart là một mảng
			const productExists = currentCart.some((item) => item.nameProduct === product.name);
			if (productExists) {
				Toast.show({
					type: "error",
					text1: "Sản phẩm đã có trong giỏ hàng"
				});
				return;
			}

			const res = await createNewCart({
				idUser: user.id,
				imageProduct: product.image,
				nameProduct: product.name,
				priceProduct: product.price,
				vendorId: product.vendorId
			});

			if (res.errCode === 0) {
				Toast.show({
					type: "success",
					text1: "Xem vào giỏ hàng thành công!👋",
				});
			}

		} catch (error) {
			console.error('Error adding product to cart:', error);
		}
	};

	const handleViewDetails = (item: Product) => {
		const productId = item._id;
		router.push(`/Products_page/${productId}`);
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

	const banners = [
		'https://i.pinimg.com/736x/3b/b8/46/3bb84646c800d861fdb64ee627607e74.jpg',
		'https://i.pinimg.com/736x/0a/ec/c6/0aecc648940982a68d54cefaf8516db7.jpg',
		'https://i.pinimg.com/736x/24/bc/ef/24bcef4070493bd086f601622ced04ea.jpg',
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f39c12' }}>
			<FlatList
				ListHeaderComponent={
					<>
						<View style={{ padding: 16 }}>
							<View style={styles.header}>
								<HamburgerMenu />
								<Text style={styles.headerTitle}>MEAT MEAL</Text>
								<TouchableOpacity onPress={() => navigation.navigate('account')}>
									<Icon name="person-outline" size={30} color="black" />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => navigation.navigate('cart')}>
									<Icon name="cart-outline" size={30} color="black" />
									{cart.length > 0 && (
										<View style={styles.cartBadge}>
											<Text style={styles.cartBadgeText}>{cart.length}</Text>
										</View>
									)}
								</TouchableOpacity>
							</View>

							<TextInput
								placeholder="Do u like eat today?"
								value={searchTerm}
								onChangeText={handleSearch}
								style={styles.searchInput}
							/>
						</View>

						<View style={styles.bannerContainer}>
							<Image source={{ uri: banners[bannerIndex] }} style={styles.bannerImage} />
						</View>

						<View style={styles.sectionTitleContainer}>
							<Text style={styles.sectionTitle}>Recommended</Text>
							<FlatList
								horizontal
								data={filteredProducts.slice(0, 5)}
								renderItem={renderProduct}
								keyExtractor={(item) => item._id}
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{ marginTop: 10 }}
							/>
						</View>
					</>
				}
				data={filteredProducts}
				renderItem={renderProduct}
				keyExtractor={(item) => item._id}
				numColumns={2}
				contentContainerStyle={{ paddingHorizontal: 16, justifyContent: 'center' }}
				ListFooterComponent={
					loading ? (
						<ActivityIndicator size="large" color="#f8c471" />
					) : (
						<View style={{ padding: 16, alignItems: 'center' }}>
							<Text style={{ fontSize: 14, color: '#FFFFFF' }}>MEAT MEAL N11</Text>
						</View>
					)
				}
			/>

			{/* Thêm Toast vào màn hình HomeScreen */}
			<Toast />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		paddingVertical: 20,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		flex: 1,
	},
	cartBadge: {
		position: 'absolute',
		top: -5,
		right: -5,
		backgroundColor: 'red',
		borderRadius: 10,
		width: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cartBadgeText: {
		color: 'white',
		fontSize: 12,
		fontWeight: 'bold',
	},
	searchInput: {
		borderWidth: 1,
		padding: 10,
		borderRadius: 10,
		marginVertical: 10,
		backgroundColor: '#ffffff',
	},
	bannerContainer: {
		width: '100%',
		height: 200,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bannerImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	sectionTitleContainer: {
		marginVertical: 16,
		paddingHorizontal: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	productContainer: {
		margin: 10,
		width: (width / 2) - 20,
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderRadius: 8,
		padding: 10,
	},
	productImage: {
		width: '100%',
		height: 150,
		borderRadius: 8,
		resizeMode: 'contain',
	},
	productName: {
		fontWeight: 'bold',
		marginVertical: 5,
		textAlign: 'center',
	},
	productPrice: {
		textAlign: 'center',
	},
	buttonContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		marginTop: 10,
	},
	detailButton: {
		backgroundColor: '#f8c471',
		padding: 10,
		borderRadius: 5,
		marginBottom: 5,
	},
	cartButton: {
		backgroundColor: '#f8c471',
		padding: 10,
		borderRadius: 5,
	},
	buttonText: {
		textAlign: 'center',
		color: '#fff',
		fontWeight: 'bold',
	},
});
