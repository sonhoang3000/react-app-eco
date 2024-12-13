import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllCart, deleteCart, updateCart } from "../../services/cartServices";
import { getAllSideDishService } from "../../services/sideDishService";
import Toast from "react-native-toast-message";
import { router } from 'expo-router';

const CartPage = () => {
	const [cartItems, setCartItems] = useState([]);
	const [sideDishes, setSideDishes] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]); // Lưu các sản phẩm được chọn
	const [total, setTotal] = useState(0);

	const fetchCart = async () => {
		try {
			const storedUser = await AsyncStorage.getItem("user");
			const user = JSON.parse(storedUser);

			if (user) {
				const response = await getAllCart();
				const userCarts = response.carts.filter(
					(cart) => cart.idUser === user.id
				);
				const sideDishIds = userCarts.flatMap(cart => cart.sideDishId || []);
				const responseAllSideDishes = await getAllSideDishService("ALL");
				const filteredSideDishes = responseAllSideDishes.sideDishes.filter(sideDish =>
					sideDishIds.includes(sideDish._id)
				);
				setSideDishes(filteredSideDishes);


				const total = userCarts.reduce((accumulator, cart) => {
					let itemTotal = cart.priceProduct * cart.number;

					const sideDishTotal = filteredSideDishes
						.filter(sideDish => cart.sideDishId?.includes(sideDish._id))
						.reduce((sideDishAcc, sideDish) => sideDishAcc + sideDish.price, 0);

					itemTotal += sideDishTotal;

					return accumulator + itemTotal;
				}, 0);

				setTotal(total);
				setCartItems(userCarts)
			} else {
				Alert.alert("Thông báo", "Xin hãy đăng nhập");
			}
		} catch (error) {
			console.error(error);
			Alert.alert('Lỗi', 'Không thể lấy danh sách giỏ hàng');
		}
	};

	useEffect(() => {
		fetchCart();
	}, []);

	const handleDeleteCart = async (id) => {
		try {
			const res = await deleteCart(id);
			if (res.errCode === 0) {
				Toast.show({
					type: "success",
					text1: res.message,
				});
				fetchCart();
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Lỗi khi xoá sản phẩm trong giỏ hàng",
			});
		}
	};

	const handleUpdateQuantiy = async (cart, type) => {
		try {
			if ((cart.number > 1 && type === "esc") || type === "desc") {
				type === "desc"
					? (cart.number = cart.number + 1)
					: (cart.number = cart.number - 1);

				const res = await updateCart(cart);

				if (res.errCode === 0) {
					fetchCart();
				}
			} else handleDeleteCart(cart._id);
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Cập nhật sản phẩm không được",
			});
		}
	};

	const toggleSelectItem = (item) => {
		if (selectedItems.includes(item)) {
			setSelectedItems(selectedItems.filter((i) => i !== item));
		} else {
			setSelectedItems([...selectedItems, item]);
		}
	};

	const renderItem = ({ item }) => (
		<View style={styles.itemContainer}>
			<Image source={{ uri: item.imageProduct }} style={styles.image} />
			<View style={styles.infoContainer}>
				<Text style={styles.name}>{item.nameProduct}</Text>
				<Text style={styles.price}>{item.priceProduct.toLocaleString()} VNĐ</Text>
				<Text style={styles.quality}>Chất lượng: {item.quality}</Text>

				{sideDishes.length > 0 && (
					<View style={styles.sideDishesContainer}>
						<Text style={styles.sideDishTitle}>Món ăn kèm:</Text>
						{sideDishes
							.filter((sideDish) => item.sideDishId?.includes(sideDish._id))
							.map(sideDish => (
								<Text key={sideDish._id} style={styles.sideDishName}>
									- {sideDish.name}: {sideDish.price.toLocaleString()} VNĐ
								</Text>
							))}
					</View>
				)}

				<View style={styles.actionsContainer}>

					<TouchableOpacity
						style={styles.selectButton}
						onPress={() => { toggleSelectItem(item) }}
					>
						<Text>
							{selectedItems.includes(item) ? "✔" : "○"}
						</Text>
					</TouchableOpacity>

					<View style={styles.quantityControls}>
						<TouchableOpacity
							style={styles.quantityButton}
							onPress={() => handleUpdateQuantiy(item, "esc")}
						>
							<Text style={styles.buttonText}>-</Text>
						</TouchableOpacity>
						<Text style={styles.quantityText}>{item.number}</Text>
						<TouchableOpacity
							style={styles.quantityButton}
							onPress={() => handleUpdateQuantiy(item, "desc")}
						>
							<Text style={styles.buttonText}>+</Text>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.deleteButton}
						onPress={() => handleDeleteCart(item._id)}
					>
						<Text style={styles.deleteText}>Xóa</Text>
					</TouchableOpacity>
				</View>



			</View>
		</View>
	);

	const handleNavigateToPayment = () => {
		router.push({
			pathname: '/(user)/payment',  // Đường dẫn trang thanh toán
			params: { selectedItems: JSON.stringify(selectedItems) }, // Chuyển thành JSON string
		});
	};

	return (

		<View style={styles.container}>
			{cartItems.length > 0 ? (
				<FlatList
					data={cartItems}
					renderItem={renderItem}
					keyExtractor={(item) => item._id}
				/>
			) : (
				<Text style={styles.emptyText}>Giỏ hàng của bạn đang trống.</Text>
			)}
			<View style={styles.cartTotalContainer}>
				<Text style={styles.totalText}>
					Tổng tiền: <Text style={styles.totalAmount}>{total.toLocaleString()} VNĐ</Text>
				</Text>
				<TouchableOpacity
					style={[
						styles.checkoutButton,
						{ backgroundColor: selectedItems.length === 0 ? '#ccc' : '#ff5722' },
					]}
					onPress={handleNavigateToPayment}  // Gọi hàm handleNavigateToPayment khi bấm vào nút
					disabled={selectedItems.length === 0}
				>
					<Text style={styles.checkoutButtonText}>Mua hàng</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};


const styles = StyleSheet.create({
	selectButton: {
		width: 30,
		height: 30,
		borderRadius: 15,
		borderWidth: 2,
		borderColor: '#ff5722',
		justifyContent: 'center',
		alignItems: 'center',
	},
	selectButtonText: {
		fontSize: 18,
		color: '#ff5722',
	},
	cartTotalContainer: {
		marginTop: 20,
		padding: 15,
		backgroundColor: '#fff',
		borderRadius: 10,
		alignItems: 'center',
		elevation: 3, // Tạo đổ bóng trên Android
		shadowColor: '#000', // Tạo đổ bóng trên iOS
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	totalText: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	totalAmount: {
		color: '#ff5722',
	},
	checkoutButton: {
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 5,
		alignItems: 'center',
	},
	checkoutButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f9f9f9',
	},
	itemContainer: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		marginBottom: 10,
		borderRadius: 8,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 1 },
		shadowRadius: 2,
		elevation: 3,
	},
	image: {
		width: 80,
		height: 80,
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
	},
	infoContainer: {
		flex: 1,
		padding: 10,
		justifyContent: 'center',
	},
	name: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	price: {
		fontSize: 14,
		color: '#ff5722',
		marginBottom: 5,
	},
	quality: {
		fontSize: 12,
		color: '#757575',
	},
	sideDishesContainer: {
		marginTop: 10,
	},
	sideDishTitle: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	sideDishName: {
		fontSize: 12,
		color: '#757575',
	},
	actionsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
	},
	quantityControls: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	quantityButton: {
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ddd',
		borderRadius: 15,
		marginHorizontal: 5,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	quantityText: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	deleteButton: {
		marginLeft: 20,
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: '#ff5252',
		borderRadius: 5,
	},
	deleteText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: 'bold',
	},
	emptyText: {
		textAlign: 'center',
		fontSize: 16,
		color: '#757575',
		marginTop: 20,
	}
});


export default CartPage;
