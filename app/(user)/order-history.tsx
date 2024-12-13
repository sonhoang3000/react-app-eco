import {
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrderHistoryByUser } from "@/services/userService";

interface ordersType {
	_id: string;
	createdAt: string;
	method: string;
	products: {
		_id: string;
		nameProduct: string;
	}[];
	side_dishes: {
		_id: string;
		name: string;
	}[];
	status: string;
	address: string;
	total: number;
}

const OrderHistory = () => {
	const [orders, setOrders] = useState<ordersType[]>([]);

	useEffect(() => {
		const fetchOrder = async () => {
			const storedUser = await AsyncStorage.getItem("user");
			if (storedUser) {
				const res = await getOrderHistoryByUser(
					JSON.parse(storedUser).id
				);
				console.log('check res', res.orders)
				if (res.errCode === 0) {
					setOrders(res.orders || []);
				}
			}
		};

		fetchOrder();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			{orders.length > 0 ? (
				<FlatList
					data={orders}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => (
						<View style={styles.card}>
							{/* Mã đơn và trạng thái */}
							<Text style={styles.orderId}>
								Mã đơn: {item._id}{" "}
								<Text style={[styles.orderStatus, item.status === 'Chưa thanh toán' ? styles.pending : styles.completed]}>
									{item.status}
								</Text>
							</Text>

							{/* Ngày và địa chỉ */}
							<Text style={styles.date}>
								Ngày: {new Date(item.createdAt).toLocaleString("vi-VN")}
							</Text>
							<Text style={styles.address}>
								Địa chỉ: {item.address}
							</Text>

							{/* Tên sản phẩm */}
							<Text style={styles.sectionTitle}>Sản phẩm:</Text>
							<Text style={styles.productList}>
								{item.products.join(", ")}
							</Text>

							{/* Món ăn kèm */}
							<Text style={styles.sectionTitle}>Món ăn kèm:</Text>
							<Text style={styles.sideDishList}>
								{item.side_dishes.join(", ")}
							</Text>

							{/* Tổng tiền */}
							<Text style={styles.total}>
								Tổng: {item.total.toLocaleString("vi-VN")} VND
							</Text>
						</View>
					)}
				/>
			) : (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>Không có lịch sử đơn hàng.</Text>
				</View>
			)}
		</SafeAreaView>
	);
};

export default OrderHistory;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f9f9f9",
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
		color: "#333",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 2,
	},
	orderId: {
		fontSize: 13,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	status: {
		color: "#1E90FF",
	},
	date: {
		fontSize: 12,
		color: "#777",
		marginBottom: 4,
	},
	address: {
		fontSize: 12,
		color: "#777",
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#333",
		marginTop: 8,
	},
	productList: {
		fontSize: 12,
		color: "#555",
		marginBottom: 4,
	},
	sideDishList: {
		fontSize: 12,
		color: "#555",
		marginBottom: 8,
	},
	total: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#333",
		marginTop: 8,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		fontSize: 16,
		color: "#aaa",
	},
	orderCard: {
		marginBottom: 10,
		backgroundColor: '#fff',
		padding: 10,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	orderHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	orderStatus: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	pending: {
		color: 'red',  // Chưa thanh toán (màu đỏ)
	},
	completed: {
		color: 'green',  // Đã thanh toán (màu xanh)
	},
	orderDate: {
		fontSize: 12,
		marginVertical: 5,
	},
	orderAddress: {
		fontSize: 12,
		marginBottom: 10,
	},
	sideDishes: {
		fontSize: 12,
		marginBottom: 5,
	},
	orderFooter: {
		marginTop: 10,
		alignItems: 'flex-end',
	},
	totalPrice: {
		fontSize: 14,
		fontWeight: 'bold',
	},
});
