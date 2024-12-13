import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getAllProductService } from "../../services/productService";
import { getAllSideDishService } from "../../services/sideDishService";
import { createNewCart, getAllCart } from "../../services/cartServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface Product {
	_id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	ingredients: string;
	category: string;
	vendorId: string,
	sideDishId: string[]
}

const ProductDetailScreen: React.FC = () => {
	const [product, setProduct] = useState<Product | null>(null);
	const [selectAddProduct, setSelectAddProduct] = useState([]);
	const router = useRouter();
	const { id } = useLocalSearchParams(); // Lấy ID sản phẩm từ URL params
	const [selectedItems, setSelectedItems] = useState([]); // State để theo dõi món đã chọn

	const [sideDishes, setSideDishes] = useState([]);

	useEffect(() => {
		const fetchProductDetails = async () => {
			try {
				const response = await fetch(`http://10.0.2.2:8080/api/get-all-product?id=${id}`);
				const data = await response.json();
				//Các món đi kèm
				const responseAddProduct = await getAllProductService("ALL")

				if (responseAddProduct && responseAddProduct.products) {
					const filteredProducts = responseAddProduct.products.filter(
						(productAddProduct) => productAddProduct.vendorId === data.products.vendorId
					);

					const finalProducts = filteredProducts.filter(
						(productAddProduct) => productAddProduct._id !== id
					);
					setSelectAddProduct(finalProducts)
				}
				// End các món đi kèm

				// các món ăn đi kèm có thể chọn hoặc không 
				const responseSideDishes = await getAllSideDishService("ALL")

				if (responseSideDishes && responseSideDishes.sideDishes) {
					const filteredSideDishes = responseSideDishes.sideDishes.filter(
						(sideDish) => data.products.sideDishId.includes(sideDish._id)
					)
					setSideDishes(filteredSideDishes)
				}

				// End các món ăn đi kèm có thể chọn hoặc không  

				if (data.errCode === 0 && data.products) {
					setProduct(data.products);
				} else {
					console.error('Sản phẩm không tìm thấy hoặc có lỗi từ API.');
				}
			} catch (error) {
				console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
			}
		};

		if (id) {
			fetchProductDetails();
		}
	}, [id]); // Chạy lại khi id thay đổi

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

	const handleViewDetails = (item: Product) => {
		const productId = item._id;
		router.push(`/Products_page/${productId}`);
	};

	const handleSelectSideDish = (item) => {
		if (selectedItems.includes(item._id)) {
			// Nếu đã chọn, bỏ chọn
			setSelectedItems(selectedItems.filter((id) => id !== item._id));
		} else {
			// Nếu chưa chọn, thêm vào danh sách
			setSelectedItems([...selectedItems, item._id]);
		}
	};

	const handleAddToCart = async (product) => {
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
				type: "info",
				text1: "Sản phẩm đã có trong giỏ hàng",
			});
			return;
		}

		try {
			const res = await createNewCart({
				idUser: user.id,
				imageProduct: product.image,
				nameProduct: product.name,
				priceProduct: product.price,
				sideDishId: selectedItems,
				vendorId: product.vendorId
			});
			if (res.errCode === 0) {
				Toast.show({
					type: "success",
					text1: "Sản phẩm đã có trong giỏ hàng",
				});
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Có lỗi xảy ra",
			});
		}

	};

	return (
		<>
			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<Image source={{ uri: product.image }} style={styles.productImage} />
				<View style={styles.productDetails}>
					<Text style={styles.productName}>{product.name}</Text>
					<Text style={styles.productPrice}>${product.price.toFixed(0)}</Text>
					<Text style={styles.productCategory}>Danh mục: {product.category}</Text>
					<TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(product)}>
						<Text style={styles.buttonText}>Thêm sản phẩm vào giỏ hàng </Text>
					</TouchableOpacity>

				</View>

				{/* Hiển thị danh sách sản phẩm đi kèm */}
				<Text style={styles.sectionTitle}>Tìm hiểu thêm các món khác </Text>
				<FlatList
					data={selectAddProduct}
					horizontal={true} // Kích hoạt cuộn ngang
					showsHorizontalScrollIndicator={true} // Tắt thanh cuộn ngang
					keyExtractor={(item) => item._id.toString()} // Dùng `_id` làm khóa duy nhất
					renderItem={({ item }) => (
						<TouchableOpacity style={styles.addProductContainer} onPress={() => handleViewDetails(item)} >
							<Image source={{ uri: item.image }} style={styles.addProductImage} />
							<Text style={styles.addProductName}>{item.name}</Text>
							<Text style={styles.addProductPrice}>${item.price.toFixed(0)}</Text>
						</TouchableOpacity>
					)}
				/>

				<Text style={styles.sectionTitle}>Các món ăn đi kèm cho {product.name}</Text>

				<FlatList
					data={sideDishes}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item._id.toString()}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => handleSelectSideDish(item)}
							style={[
								styles.sideDishContainer,
								selectedItems.includes(item._id) && styles.selectedContainer, // Thay đổi màu nền nếu đã chọn
							]}
						>
							<View style={styles.selectionIndicator}>
								{selectedItems.includes(item._id) && <View style={styles.circle}></View>}
							</View>
							<Image source={{ uri: item.image }} style={styles.sideDishImage} />
							<Text style={styles.sideDishName}>{item.name}</Text>
							<Text style={styles.sideDishPrice}>${item.price.toFixed(0)}</Text>
						</TouchableOpacity>
					)}
				/>

				{/* Thêm Toast vào màn hình HomeScreen */}
			</ScrollView>
			<Toast />
		</>



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
	cartButton: {
		backgroundColor: '#f8c471',
		padding: 10,
		borderRadius: 5,
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
	scrollViewContent: {
		padding: 16,
		backgroundColor: "#fff",
	},
	productImage: {
		width: "100%",
		height: 250,
		resizeMode: "cover",
		borderRadius: 8,
	},
	productDetails: {
		marginTop: 16,
	},
	productName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	productPrice: {
		fontSize: 20,
		color: "#FF5733",
		marginVertical: 8,
	},
	productCategory: {
		fontSize: 16,
		color: "#777",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginVertical: 16,
		color: "#444",
	},
	addProductContainer: {
		marginRight: 16,
		alignItems: "center",
	},
	addProductImage: {
		width: 100,
		height: 100,
		resizeMode: "cover",
		borderRadius: 8,
	},
	addProductName: {
		marginTop: 8,
		fontSize: 14,
		color: "#555",
		textAlign: "center",
	},
	addProductPrice: {
		fontSize: 14,
		color: "#FF5733",
		textAlign: "center",
	},
	sideDishContainer: {
		margin: 10,
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#e0f7fa",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#00796b",
	},
	selectionIndicator: {
		position: "absolute",
		top: 5,
		right: 5,
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#00796b",
		justifyContent: "center",
		alignItems: "center",
	},
	circle: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#00796b",
	},
	sideDishImage: {
		width: 50,
		height: 50,
		borderRadius: 5,
	},
	sideDishName: {
		marginTop: 5,
		fontSize: 14,
		fontWeight: "bold",
	},
	sideDishPrice: {
		marginTop: 2,
		fontSize: 12,
		color: "#757575",
	},
});

export default ProductDetailScreen;
