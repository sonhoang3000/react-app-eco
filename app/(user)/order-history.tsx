import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getOrderHistoryByUser } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ordersType {
  _id: string;
  createdAt: string;
  method: string;
  products: {
    _id: string;
    imageProduct: string;
    nameProduct: string;
    number: number;
    priceProduct: number;
  }[];
  side_dishes: {
    _id: string;
    availability: boolean;
    category: string;
    description: string;
    image: string;
    name: string;
    number: number;
    price: number;
  }[];
  status: string;
  updatedAt: string;
  userId: string;
}
const OrderHistory = () => {
  const [orders, setOrders] = useState<ordersType[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      const storedUser = await AsyncStorage.getItem("user");

      console.log("storedUser", storedUser);
      if (storedUser) {
        const res = (await getOrderHistoryByUser(
          JSON.parse(storedUser).id
        )) as any;
        if (res.errCode === 0) {
          setOrders(res?.orders || []);
        }
      }
    };
    fetchOrder();
  }, []);

  const renderOrder = ({ item }: { item: ordersType }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Mã đơn: {item._id}</Text>
        <Text style={styles.orderStatus}>{item.status}</Text>
      </View>
      <FlatList
        data={item.products}
        keyExtractor={(product) => product._id}
        renderItem={({ item: product }) => (
          <View>
            <View style={styles.productRow}>
              <Image
                source={{ uri: product.imageProduct }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.nameProduct}</Text>
                <Text style={styles.productPrice}>${product.priceProduct}</Text>
                <Text style={styles.productQuantity}>
                  Qty: {product.number}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
      {item.side_dishes.length ? (
        <>
          <Text style={{ fontSize: 18, marginVertical: 12 }}>Món phụ:</Text>
          <FlatList
            data={item.side_dishes}
            keyExtractor={(product) => product._id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: product }) => (
              <View>
                <View style={styles.productRow}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>${product.price}</Text>
                    <Text style={styles.productQuantity}>
                      Qty: {product.number}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        </>
      ) : null}
      <View style={styles.orderFooter}>
        <Text style={styles.orderDate}>
          Date: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no order history.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    maxWidth: 200,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#46CFE1",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#46CFE1",
    marginTop: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  orderDate: {
    fontSize: 14,
    color: "#777",
  },
  reorderButton: {
    backgroundColor: "#46CFE1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  reorderText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
